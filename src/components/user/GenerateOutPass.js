import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./generateOutpass.css";

const GenerateOutpass = () => {
  const [outpassDetails, setOutpassDetails] = useState({
    name: "",
    year: "",
    roomNumber: "",  // to be fetched from booked room details
    reason: "",
    checkIn: "",
    checkOut: ""
  });
  const [generated, setGenerated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user profile and update state (with loading state)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
        // Also set name and year from user profile
        setOutpassDetails(prev => ({
          ...prev,
          name: response.data.name || "",
          year: String(response.data.year) || ""
        }));
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [token]);

  

  // Fetch booked room details to set roomNumber from the Room schema
  useEffect(() => {
    const fetchBookedRoom = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/room/book", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.room) {
          setOutpassDetails(prev => ({
            ...prev,
            roomNumber: String(response.data.room.roomNumber) || ""
          }));
        }
      } catch (error) {
        alert("You do not have a booked room. Redirecting to homepage.");
        navigate("/home");
      }
    };

    fetchBookedRoom();
  }, [token]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOutpassDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(outpassDetails.name, outpassDetails.year, outpassDetails.roomNumber, outpassDetails.reason, outpassDetails.checkIn, outpassDetails.checkOut);


    try {
      await axios.post(
        "http://localhost:5000/api/outpass",
        { ...outpassDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGenerated(true);
      // After successful generation, navigate to the outpasses page
      navigate("/outpass");
    } catch (error) {
      console.error("Error submitting outpass:", error);
      alert("Failed to generate outpass. Please try again.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container generate-outpass mt-5">
      <h2 className="text-center mb-4">Generate Outpass</h2>
      {!generated ? (
        <form onSubmit={handleSubmit} className="outpass-form">
          {/* The Name, Year, and Room Number are set via profile & booked room details */}
          <div className="form-group mb-3">
            <label>Reason for Going Out:</label>
            <textarea
              name="reason"
              className="form-control"
              rows="3"
              value={outpassDetails.reason}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group mb-3">
            <label>Check-Out Date:</label>
            <input
              type="date"
              name="checkOut"
              className="form-control"
              value={outpassDetails.checkOut}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Check-In Date:</label>
            <input
              type="date"
              name="checkIn"
              className="form-control"
              value={outpassDetails.checkIn}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Generate Outpass
          </button>
          <button
              className="btn btn-secondary w-100 mt-3"
              onClick={() => { setGenerated(false); navigate("/user-outpasses") }}
            >
              View Outpasses
            </button>
        </form>
      ) : (
        <div className="outpass-receipt">
          <div className="receipt-header text-center mb-4">
            <h3>Hostel Outpass</h3>
            <p>
              Issued on {currentDate} at {currentTime}
            </p>
          </div>
          <div className="receipt-body">
            <p>
              I, <strong>{outpassDetails.name}</strong>, a student of{" "}
              <strong>{outpassDetails.year}</strong> year, residing in room{" "}
              <strong>{outpassDetails.roomNumber}</strong>, formally request
              permission to leave the hostel premises.
            </p>
            <p>The purpose of my request is as follows:</p>
            <p>
              <strong>Reason:</strong> {outpassDetails.reason}
            </p>
            <p>
              I intend to leave on <strong>{outpassDetails.checkOut}</strong> and
              return on <strong>{outpassDetails.checkIn}</strong>. I assure compliance
              with all hostel regulations and will report back as scheduled.
            </p>
          </div>
          <div className="actions mt-4">
            <button className="btn btn-primary w-100" onClick={handlePrint}>
              Print Outpass
            </button>
            <button
              className="btn btn-secondary w-100 mt-3"
              onClick={() => { setGenerated(false); navigate("/user-outpasses") }}
            >
              View Outpasses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateOutpass;
