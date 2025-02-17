import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../ui/card.js";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap for navbar styling
import "./Profile.css";

const ProfileView = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize `useNavigate`

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token
        if (!token) {
          throw new Error("❌ No token found. Please log in again.");
        }

        const response = await axios.get(
          `http://localhost:5000/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Fetched Profile Data:", response.data);
        setProfileData(response.data);
      } catch (err) {
        console.error("❌ Error fetching profile data:", err);
        setError("❌ Unauthorized - Please log in again.");
        localStorage.removeItem("token"); // ✅ Clear invalid token
        navigate("/login"); // ✅ Redirect to login if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/home">
            <span className="hostel-logo">🏠 HostelHub</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              {["Home", "About", "Experiences", "Resources", "Contact"].map((item) => (
                <li key={item} className="nav-item">
                  <Link className="nav-link" to={`/${item.toLowerCase()}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="user-profile">
            <FaUserCircle
              size={32}
              className="profile-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="profile-dropdown">
                <Link to="/profileview" className="dropdown-item">👤 Profile</Link>
                <Link to="/logout" className="dropdown-item">🚪 Logout</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Profile Details Section */}
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
        <Card className="max-w-5xl w-full shadow-lg p-6 bg-white rounded-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Profile Details</h2>
          {profileData ? (
            <div className="space-y-6">
              {/* ✅ Personal Details */}
              <CardContent>
                <h3 className="text-xl font-semibold mb-3">Personal Details</h3>
                <p><strong>Name:</strong> {profileData.name}</p>
                <p><strong>Date of Birth:</strong> {profileData.dob}</p>
                <p><strong>Gender:</strong> {profileData.gender}</p>
                <p><strong>Nationality:</strong> {profileData.nationality}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Contact Number:</strong> {profileData.contactNumber}</p>
                <p><strong>Alternate Contact Number:</strong> {profileData.altContact}</p>
                <p><strong>Parent/Guardian Name:</strong> {profileData.guardianName}</p>
                <p><strong>Parent/Guardian Contact:</strong> {profileData.guardianContact}</p>
              </CardContent>

              {/* ✅ Academic Details */}
              <CardContent>
                <h3 className="text-xl font-semibold mb-3">Academic Details</h3>
                <p><strong>Student ID:</strong> {profileData.studentID}</p>
                <p><strong>Course:</strong> {profileData.course}</p>
                <p><strong>Year/Semester:</strong> {profileData.year}</p>
                <p><strong>Department:</strong> {profileData.department}</p>
                <p><strong>University:</strong> {profileData.university}</p>
              </CardContent>

              {/* ✅ Emergency Details */}
              <CardContent>
                <h3 className="text-xl font-semibold mb-3">Emergency Details</h3>
                <p><strong>Blood Group:</strong> {profileData.bloodGroup}</p>
                <p><strong>Medical Conditions:</strong> {profileData.medical}</p>
                <p><strong>Allergies:</strong> {profileData.allergies}</p>
                <p><strong>Emergency Contact Name:</strong> {profileData.emergencyName}</p>
                <p><strong>Emergency Contact Number:</strong> {profileData.emergencyContact}</p>
                <p><strong>Health Insurance:</strong> {profileData.insurance}</p>
              </CardContent>

              {/* ✅ Uploaded Documents */}
              <CardContent>
                <h3 className="text-xl font-semibold mb-3">Uploaded Documents</h3>
                {profileData.documents && profileData.documents.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {profileData.documents.map((doc, index) => (
                      <li key={index}><a href={`http://localhost:5000/uploads/${doc}`} target="_blank" rel="noopener noreferrer">{doc}</a></li>
                    ))}
                  </ul>
                ) : (
                  <p>No documents uploaded.</p>
                )}
              </CardContent>
            </div>
          ) : (
            <p>No profile data available.</p>
          )}
        </Card>
      </div>
    </>
  );
};

export default ProfileView;
