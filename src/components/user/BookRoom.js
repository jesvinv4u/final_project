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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
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

  const [rooms, setRooms] = useState(initialRooms);
  const [activeFloor, setActiveFloor] = useState(null);
  const [recentBooking, setRecentBooking] = useState(null);

  const handleBooking = (floor, roomIndex) => {
    if (rooms[floor][roomIndex] > 0) {
      setRooms((prev) => {
        const updatedFloor = [...prev[floor]];
        updatedFloor[roomIndex] -= 1;
        return { ...prev, [floor]: updatedFloor };
      });

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();

      const bookingDetails = {
        ...userProfile,
        floor,
        roomNumber: roomIndex + 1,
        date: formattedDate,
        time: formattedTime,
      };

      setRecentBooking(bookingDetails);

      alert(`Room ${roomIndex + 1} booked successfully on Floor ${floor}!`);
    } else {
      alert(`Room ${roomIndex + 1} on Floor ${floor} is already full.`);
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
              disabled={availability === 0}
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

      {/* Display User Profile */}
      {loading ? (
        <div>Loading profile...</div>
      ) : userProfile ? (
        <div className="user-profile mb-4">
          <h4>User Profile</h4>
          <p><strong>Name:</strong> {userProfile.name}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Contact:</strong> {userProfile.contactNumber}</p>
          <p><strong>Department:</strong> {userProfile.department}</p>
          <p><strong>Student ID:</strong> {userProfile.studentID}</p>
        </div>
      ) : (
        <div>❌ Error loading profile</div>
      )}

      {/* Floor Selection */}
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

      {/* Recent Booking Details */}
      {recentBooking && (
        <div className="recent-booking mt-5">
          <h4 className="text-center">Recent Booking Receipt</h4>
          <p><strong>Date:</strong> {recentBooking.date}</p>
          <p><strong>Time:</strong> {recentBooking.time}</p>
          <p><strong>Name:</strong> {recentBooking.name}</p>
          <p><strong>Email:</strong> {recentBooking.email}</p>
          <p><strong>Phone:</strong> {recentBooking.phone}</p>
          <p><strong>Year:</strong> {recentBooking.year}</p>
          <p><strong>Branch:</strong> {recentBooking.branch}</p>
          <p><strong>Hostel Block:</strong> {recentBooking.block}</p>
          <p><strong>Floor:</strong> {recentBooking.floor}</p>
          <p><strong>Room Number:</strong> {recentBooking.roomNumber}</p>
        </div>
      )}
    </div>
  );
};

export default BookRoom;