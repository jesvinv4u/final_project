import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./complaints.css";

const Complaints = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [chatLog, setChatLog] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [customInput, setCustomInput] = useState("");
  const [complaintData, setComplaintData] = useState({
    complaintType: "",
    problem: "",
  });

  // Fetch user profile
  useEffect(() => {
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
    fetchUserProfile();
  }, [token]);

  // Fetch booked room details (to get room number) and redirect if not found
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

  // Chat flow steps
  const chatSteps = {
    1: {
      id: 1,
      message: "What kind of problem are you facing?",
      options: [
        { label: "Room Issues", next: 2 },
        { label: "Mess/Food Issues", next: 3 },
        { label: "Facilities (Wi-Fi, Water, etc.)", next: 4 },
        { label: "Rights or Misconduct", next: 5 },
        { label: "Other / Not Listed", next: 6 },
      ],
    },
    2: {
      id: 2,
      message: "What is the issue with your room?",
      options: [
        { label: "Broken furniture", next: "submit" },
        { label: "Dirty room on arrival", next: "submit" },
        { label: "AC/Fan not working", next: "submit" },
        { label: "Light not working", next: "submit" },
        { label: "None of these", next: 6 },
      ],
    },
    3: {
      id: 3,
      message: "What is the issue with the mess/food?",
      options: [
        { label: "Food quality is poor", next: "submit" },
        { label: "Mess is unhygienic", next: "submit" },
        { label: "Food is not served on time", next: "submit" },
        { label: "None of these", next: 6 },
      ],
    },
    4: {
      id: 4,
      message: "What facility is causing issues?",
      options: [
        { label: "Wi-Fi not working", next: "submit" },
        { label: "Water supply issue", next: "submit" },
        { label: "Electricity issue", next: "submit" },
        { label: "None of these", next: 6 },
      ],
    },
    5: {
      id: 5,
      message: "What is the issue related to rights or misconduct?",
      options: [
        { label: "Harassment or bullying", next: "submit" },
        { label: "Violation of hostel rules", next: "submit" },
        { label: "None of these", next: 6 },
      ],
    },
    6: {
      id: 6,
      message: "Please describe your issue:",
      input: true,
      next: "submit",
    },
    submit: {
      id: "submit",
      message: "Click the button below to submit your complaint.",
    },
  };

  // Handle predefined option click
  const handleOptionClick = (option) => {
    const nextStep = option.next;
    setChatLog((prev) => [
      ...prev,
      { sender: "user", message: option.label },
      { sender: "bot", message: chatSteps[nextStep].message },
    ]);
    if (currentStep === 1) {
      setComplaintData((prev) => ({ ...prev, complaintType: option.label }));
    }
    if (nextStep === "submit") {
      setComplaintData((prev) => ({ ...prev, problem: option.label }));
    }
    setCurrentStep(nextStep);
  };

  // Handle free text input (step 6)
  const handleInputSubmit = () => {
    const nextStep = chatSteps[currentStep].next;
    setChatLog((prev) => [
      ...prev,
      { sender: "user", message: customInput },
      { sender: "bot", message: chatSteps[nextStep].message },
    ]);
    if (currentStep === 6) {
      setComplaintData((prev) => ({ ...prev, problem: customInput }));
    }
    setCustomInput("");
    setCurrentStep(nextStep);
  };

  // Final complaint submission with room number added
  const handleSubmit = () => {
    const finalData = {
      ...complaintData,
      name: userProfile?.name || "Unknown",
      email: userProfile?.email || "Unknown",
      roomNumber: currentRoom || "Not Booked",
    };

    fetch("http://localhost:5000/api/complaints", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalData),
    })
      .then((response) => {
        console.log("Response:", response);
        if (response.ok) {
          alert("Complaint submitted successfully!");
          setChatLog([]);
          setCurrentStep(1);
          setComplaintData({ complaintType: "", problem: "" });
        } else {
          alert("Failed to submit complaint. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error submitting complaint:", error);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className="container complaints mt-5">
      <h2 className="text-center mb-4">Chat Assistant - Raise a Complaint</h2>
      <div className="chat-box">
        <div className="chat-log">
          {chatLog.map((entry, index) => (
            <div
              key={index}
              className={`chat-message ${
                entry.sender === "bot" ? "bot-message" : "user-message"
              }`}
            >
              {entry.message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          {chatSteps[currentStep].options ? (
            chatSteps[currentStep].options.map((option, index) => (
              <button
                key={index}
                className="btn btn-primary m-2"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </button>
            ))
          ) : chatSteps[currentStep].input ? (
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type your response here..."
              />
              <button
                className="btn btn-primary"
                onClick={handleInputSubmit}
                disabled={!customInput.trim()}
              >
                Submit
              </button>
            </div>
          ) : currentStep === "submit" ? (
            <div>
              <button className="btn btn-success" onClick={handleSubmit}>
                Confirm and Submit
              </button>
              <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                Start Over
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-4 text-center">
        <Link to="/user-complaints" className="btn btn-info">
          View My Complaints
        </Link>
      </div>
    </div>
  );
};

export default Complaints;
