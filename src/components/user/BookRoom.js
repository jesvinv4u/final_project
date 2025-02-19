import React, { useState, useEffect } from "react";
import axios from "axios";
import "./bookRoom.css";

const BookRoom = () => {
  const initialRooms = {
    1: Array(20).fill(2),
    2: Array(20).fill(2),
    3: Array(20).fill(2),
    4: Array(20).fill(2),
    5: Array(20).fill(2),
  };

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [rooms, setRooms] = useState(initialRooms);
  const [activeFloor, setActiveFloor] = useState(null);
  // recentBooking will be set once a booking request has been submitted & (later) approved
  const [recentBooking, setRecentBooking] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleBooking = async (floor, roomIndex) => {
    // Prevent booking if a request has already been submitted
    if (recentBooking) {
      alert("You have already submitted a booking request and cannot book again.");
      return;
    }

    if (!userProfile) {
      alert("User profile not loaded.");
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    const bookingRequest = {
      name: userProfile.name,
      email: userProfile.email,
      floor,
      roomNumber: roomIndex + 1,
      date: formattedDate,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/room-requests/submit-request",
        bookingRequest,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message); // "Booking request submitted successfully!"
      // Save the request details (pending approval)
      setRecentBooking({ ...bookingRequest, ...userProfile, status: "Pending" });
    } catch (error) {
      console.error("Error submitting booking request:", error);
      alert("Error submitting booking request. Please try again.");
    }
  };

  const handleFloorClick = (floor) => {
    setActiveFloor((prevFloor) => (prevFloor === floor ? null : floor));
  };

  const renderRooms = (floor) => (
    <div className="floor">
      <h4>Floor {floor}</h4>
      <div className="rooms">
        {rooms[floor].map((availability, index) => (
          <div className="room" key={index}>
            <p>Room {index + 1}</p>
            <button
              className={`btn ${
                availability > 0 ? "btn-success" : "btn-danger"
              }`}
              onClick={() => handleBooking(floor, index)}
              disabled={availability === 0 || recentBooking !== null}
            >
              {availability === 2
                ? "2 Available"
                : availability === 1
                ? "1 Available"
                : "Full"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container book-room mt-5">
      <h2 className="text-center mb-4">Book Room for Hostlers</h2>
      {loading ? (
        <div>Loading profile...</div>
      ) : userProfile ? (
        <div className="user-profile mb-4">
          <h4>User Profile</h4>
          <p>
            <strong>Name:</strong> {userProfile.name}
          </p>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Contact:</strong> {userProfile.contactNumber}
          </p>
          <p>
            <strong>Department:</strong> {userProfile.department}
          </p>
          <p>
            <strong>Student ID:</strong> {userProfile.studentID}
          </p>
        </div>
      ) : (
        <div>❌ Error loading profile</div>
      )}

      <div className="floors">
        <div className="floor-buttons">
          {Object.keys(rooms).map((floor) => (
            <button
              key={floor}
              className="btn btn-primary mx-2"
              onClick={() => handleFloorClick(Number(floor))}
            >
              {`Floor ${floor}`}
            </button>
          ))}
        </div>
        {activeFloor && renderRooms(activeFloor)}
      </div>

      {recentBooking && (
        <div className="recent-booking mt-5">
          <h4 className="text-center">Recent Booking Receipt</h4>
          <p>
            <strong>Date:</strong> {recentBooking.date}
          </p>
          <p>
            <strong>Name:</strong> {recentBooking.name}
          </p>
          <p>
            <strong>Email:</strong> {recentBooking.email}
          </p>
          <p>
            <strong>Floor:</strong> {recentBooking.floor}
          </p>
          <p>
            <strong>Room Number:</strong> {recentBooking.roomNumber}
          </p>
          <p>
            <strong>Status:</strong> {recentBooking.status}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookRoom;