import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserComplaintsPage.css";

const UserComplaintsPage = () => {
  const token = localStorage.getItem("token");
  const [userProfile, setUserProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user's profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  };

  // Fetch all complaints and filter by logged-in user's email
  const fetchComplaints = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/complaints");
      const userComplaints = response.data.filter(
        (complaint) => complaint.email === (userProfile?.email || "")
      );
      setComplaints(userComplaints);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching complaints:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    if (userProfile) {
      fetchComplaints();
    }
  }, [userProfile]);

  // Handle marking the complaint as resolved
  const handleResolve = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status: "Resolved" });
      // Refresh the complaints list after updating the status
      fetchComplaints();
    } catch (error) {
      console.error("❌ Error updating complaint:", error);
      alert("Failed to update complaint. Please try again.");
    }
  };

  return (
    <div className="user-complaints-container">
      <h2>Your Complaints</h2>
      {loading ? (
        <p>Loading your complaints...</p>
      ) : complaints.length === 0 ? (
        <p>You have no complaints.</p>
      ) : (
        complaints.map((complaint) => (
          <div key={complaint._id} className="complaint-card">
            <h4>Type: {complaint.complaintType}</h4>
            <p><strong>Issue:</strong> {complaint.problem}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={complaint.status.toLowerCase()}>
                {complaint.status}
              </span>
            </p>
            {complaint.status.toLowerCase() === "pending" && (
              <button onClick={() => handleResolve(complaint._id)} className="resolve-btn">
                Mark as Resolved
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserComplaintsPage;