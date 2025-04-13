import React, { useState, useEffect } from "react";
import axios from "axios";
import "./bookRoom.css";

const BookRoom = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomDetails, setRoomDetails] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserBooking = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/room/book/", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        // If booking exists
        if (response.data && response.data.room) {
          setRoomDetails(response.data.room);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("✅ No existing booking for user.");
          setRoomDetails(null); // Explicitly set null
        } else {
          console.error("❌ Error fetching booking:", error);
        }
      }
    };
    

    fetchUserProfile();
    fetchUserBooking();
  }, [token]);

  const handleBooking = async () => {
    // If roomDetails exists from fetchUserBooking, it means the user has an active booking.
    if (roomDetails) {
      console.log("Existing booking:", roomDetails);
      alert("You have already booked a room.");
      return;
    }

    if (!userProfile) {
      alert("User profile not loaded.");
      return;
    }

    try {
      
      const response = await axios.post(
        "http://localhost:5000/api/room/book/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      setRoomDetails(response.data.room);
    } catch (error) {
      console.error("Error booking room:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Error booking room. Please try again.");
      }
    }
  };

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
          <p>
            <strong>Year:</strong> {userProfile.year}
          </p>
        </div>
      ) : (
        <div>❌ Error loading profile</div>
      )}

      {!roomDetails ? (
        <div className="booking-section text-center">
          <button className="btn btn-primary" onClick={handleBooking}>
            Book My Room (Auto Assignment)
          </button>
        </div>
      ) : (
        <div className="recent-booking mt-5">
          <h4 className="text-center">Room Booking Receipt</h4>
          <p>
            <strong>Room Number:</strong> {roomDetails.roomNumber}
          </p>
          <p>
            <strong>Floor:</strong> {roomDetails.floor}
          </p>
          <p>
            <strong>Status: Successful</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default BookRoom;