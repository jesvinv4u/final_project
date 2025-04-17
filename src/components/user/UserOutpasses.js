import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserOutpasses = () => {
  const [userOutpasses, setUserOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user profile and store userId (and optionally email)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(res.data._id); // Assuming the user id field is _id
        setUserEmail(res.data.email);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Fetch outpasses for this user using userId
  useEffect(() => {
    const fetchUserOutpasses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/outpass/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // The backend route already filters by userId,
        // so there's no need to filter the results here.
        setUserOutpasses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching outpass data:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserOutpasses();
    }
  }, [token, userId]);

  return (
    <div className="container mt-5">
      <h2>Your Outpasses</h2>
      {loading ? (
        <div>Loading outpasses...</div>
      ) : userOutpasses.length === 0 ? (
        <p>You haven't taken any outpasses yet.</p>
      ) : (
        <ul>
          {userOutpasses.map((outpass) => (
            <li key={outpass._id}>
              <strong>{outpass.name}</strong> – Room {outpass.roomNumber} –{" "}
              Issued on {new Date(outpass.createdAt).toLocaleDateString()}
              <br />
              <span>
                Check-Out: {new Date(outpass.checkOut).toLocaleDateString()} | Check-In:{" "}
                {new Date(outpass.checkIn).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default UserOutpasses;