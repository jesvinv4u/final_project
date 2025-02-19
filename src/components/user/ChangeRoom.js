import React, { useState, useEffect } from "react";
import axios from "axios";
import "./changeRoom.css";

const ChangeRoom = () => {
  const token = localStorage.getItem("token");

  // State to store user profile from API
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile info similar to BookRoom.js
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

  // Change request state
  const [changeRequest, setChangeRequest] = useState({
    desiredRoom: "",
    reason: "",
  });
  const [recentRequest, setRecentRequest] = useState(null);

  // Define available rooms (filter out current room if available)
  let availableRooms = ["102", "103", "104", "105"];
  if (userProfile && userProfile.currentRoom) {
    availableRooms = availableRooms.filter(
      (room) => room !== userProfile.currentRoom
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChangeRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (changeRequest.desiredRoom && changeRequest.reason) {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();

      const requestDetails = {
        ...userProfile,
        ...changeRequest,
        date: formattedDate,
        time: formattedTime,
      };

      setRecentRequest(requestDetails);
      alert("Room Change Request Submitted Successfully!");
      setChangeRequest({ desiredRoom: "", reason: "" });
    } else {
      alert("Please complete all fields before submitting the request.");
    }
  };

  return (
    <div className="container change-room mt-5">
      <h2 className="text-center mb-4">Room Change Management</h2>

      {loading ? (
        <div>Loading profile...</div>
      ) : userProfile ? (
        <>
          {/* Logged-in User Profile */}
          <div className="user-profile mb-4">
            <h4>Logged-in User Profile</h4>
            <p>
              <strong>Name:</strong> {userProfile.name}
            </p>
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <p>
              <strong>Contact:</strong> {userProfile.contactNumber}
            </p>
            
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
                  value={userProfile.currentRoom}
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
                    <option key={room} value={room}>
                      {room}
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

      {/* Recent Request */}
      {recentRequest && (
        <div className="recent-request mt-5">
          <h4 className="text-center">Recent Room Change Request</h4>
          <p>
            <strong>Date:</strong> {recentRequest.date}
          </p>
          <p>
            <strong>Time:</strong> {recentRequest.time}
          </p>
          <p>
            <strong>Name:</strong> {recentRequest.name}
          </p>
          <p>
            <strong>Email:</strong> {recentRequest.email}
          </p>
          <p>
            <strong>Contact:</strong> {recentRequest.contactNumber}
          </p>
          <p>
            <strong>Current Room:</strong> {recentRequest.currentRoom}
          </p>
          <p>
            <strong>Desired Room:</strong> {recentRequest.desiredRoom}
          </p>
          <p>
            <strong>Block:</strong> {recentRequest.block}
          </p>
          <p>
            <strong>Reason:</strong> {recentRequest.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChangeRoom;
