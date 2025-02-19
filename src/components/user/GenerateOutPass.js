import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./generateOutpass.css";

const GenerateOutpass = () => {
  const [outpassDetails, setOutpassDetails] = useState({
    name: "",
    year: "",
    roomNumber: "",
    reason: "",
    checkIn: "",
    checkOut: ""
  });
  const [generated, setGenerated] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOutpassDetails(prev => ({
          ...prev,
          name: response.data.name || "",
          year: response.data.year || "",
          roomNumber: response.data.roomNumber || ""
        }));
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOutpassDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/outpass",
        { ...outpassDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGenerated(true);
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

  return (
    <div className="container generate-outpass mt-5">
      <h2 className="text-center mb-4">Generate Outpass</h2>
      {!generated ? (
        <form onSubmit={handleSubmit} className="outpass-form">
          <div className="form-group mb-3">
            <label>Name of Student:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={outpassDetails.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Year of Study:</label>
            <input
              type="text"
              name="year"
              className="form-control"
              value={outpassDetails.year}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Room Number:</label>
            <input
              type="text"
              name="roomNumber"
              className="form-control"
              value={outpassDetails.roomNumber}
              onChange={handleInputChange}
              required
            />
          </div>
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
        </form>
      ) : (
        <div className="outpass-receipt">
          <div className="receipt-header text-center mb-4">
            <h3>Hostel Outpass</h3>
            <p>Issued on {currentDate} at {currentTime}</p>
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
              return on <strong>{outpassDetails.checkIn}</strong>. I assure compliance with
              all hostel regulations and will report back as scheduled.
            </p>
          </div>
          <div className="actions mt-4">
            <button className="btn btn-primary w-100" onClick={handlePrint}>
              Print Outpass
            </button>
            <button
              className="btn btn-secondary w-100 mt-3"
              onClick={() => setGenerated(false)}
            >
              Generate Another Outpass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateOutpass;
