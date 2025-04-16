import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./changeRoom.css";

const ChangeRoom = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // State to store user profile, booked room, and available rooms
  const [userProfile, setUserProfile] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);

  // State for room change request (form inputs)
  const [changeRequest, setChangeRequest] = useState({
    desiredRoom: "",
    reason: "",
  });
  // State to store the recent ticket returned from the backend
  const [recentRequest, setRecentRequest] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
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

  // Fetch booked room details and redirect if not found
  useEffect(() => {
    const fetchBookedRoom = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/room/book", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.room) {
          console.log("Booked room found:", response.data.room);
          setCurrentRoom(response.data.room.roomNumber);
        } else {
          alert("You do not have a booked room. Redirecting to homepage.");
          navigate("/home");
        }
      } catch (error) {
        alert("You do not have a booked room. Redirecting to homepage.");
        navigate("/home");
      }
    };

    fetchBookedRoom();
  }, [token, navigate]);

  // Fetch available rooms – exclude user's current room
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/room/available", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.rooms) {
          let allRooms = Array.isArray(response.data.rooms)
            ? response.data.rooms
            : [response.data.rooms];
          if (currentRoom) {
            allRooms = allRooms.filter(
              (room) => room.roomNumber !== currentRoom
            );
          }
          setAvailableRooms(allRooms);
        }
      } catch (error) {
        console.error("❌ Error fetching available rooms:", error);
      }
    };

    if (currentRoom) {
      fetchAvailableRooms();
    }
  }, [token, currentRoom]);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChangeRequest((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create a ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!changeRequest.desiredRoom || !changeRequest.reason) {
      alert("Please complete all fields before submitting the request.");
      return;
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    // Prepare ticket object with currentRoom from booked room details
    const ticket = {
      name: userProfile?.name,
      email: userProfile?.email,
      contactNumber: userProfile?.contactNumber,
      currentRoom: currentRoom,
      desiredRoom: changeRequest.desiredRoom,
      reason: changeRequest.reason,
      date: formattedDate,
      time: formattedTime,
      status: "Pending"
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ticket/create",
        ticket,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );
      // On success, store the returned ticket details in recentRequest state
      setRecentRequest(response.data);
      alert("Room Change Request Submitted Successfully!");
      setChangeRequest({ desiredRoom: "", reason: "" });
    } catch (error) {
      console.error("❌ Error submitting ticket:", error);
      alert(`Failed to submit request: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container change-room mt-5">
      <h2 className="text-center mb-4">Room Change Management</h2>
      {loading ? (
        <div>Loading profile...</div>
      ) : userProfile ? (
        <>
          {/* User Profile Display */}
          <div className="user-profile mb-4">
            <h4>Logged-in User Profile</h4>
            <p><strong>Name:</strong> {userProfile.name}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Contact:</strong> {userProfile.contactNumber}</p>
            <p><strong>Current Room:</strong> {currentRoom}</p>
          </div>

          {/* Change Room Form */}
          <div className="change-room-form">
            <h4>Request Room Change</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Current Room:</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentRoom}
                  readOnly
                />
              </div>

              <div className="form-group mb-3">
                <label>Desired Room:</label>
                <select
                  name="desiredRoom"
                  className="form-control"
                  value={changeRequest.desiredRoom}
                  onChange={handleInputChange}
                >
                  <option value="">Select Desired Room</option>
                  {availableRooms.map((room) => (
                    <option key={room._id} value={room.roomNumber}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Reason for Change:</label>
                <textarea
                  name="reason"
                  className="form-control"
                  rows="4"
                  placeholder="Enter Reason for Room Change"
                  value={changeRequest.reason}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-success w-100">
                Submit Request
              </button>
            </form>
          </div>
        </>
      ) : (
        <div>❌ Error loading profile</div>
      )}

      {/* Recent Request Display */}
      {recentRequest && (
        <div className="recent-request mt-5">
          <h4 className="text-center">Recent Room Change Request</h4>
          <p><strong>Date:</strong> {recentRequest.date}</p>
          <p><strong>Time:</strong> {recentRequest.time}</p>
          <p><strong>Name:</strong> {recentRequest.name}</p>
          <p><strong>Email:</strong> {recentRequest.email}</p>
          <p><strong>Contact:</strong> {recentRequest.contactNumber}</p>
          <p><strong>Current Room:</strong> {recentRequest.currentRoom}</p>
          <p><strong>Desired Room:</strong> {recentRequest.desiredRoom}</p>
          <p><strong>Reason:</strong> {recentRequest.reason}</p>
          <p><strong>Status:</strong> {recentRequest.status}</p>
        </div>
      )}
    </div>
  );
};

export default ChangeRoom;
