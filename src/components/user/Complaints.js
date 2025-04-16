import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./complaints.css";

const Complaints = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user profile from backend
  const [userProfile, setUserProfile] = useState(null);
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

  // Redirect user if no valid profile is found
  useEffect(() => {
    const fetchBookedRoom = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/room/book", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.room) {
          console.log("Booked room found:");
        } else {
          alert("You do not have a booked room. Redirecting to homepage.",response.data.room);
          navigate("/home");
        }
      } catch (error) {
        alert("You do not have a booked room. Redirecting to homepage.");
        navigate("/home");
      }
    };

    fetchBookedRoom();
  }, [token, navigate]);

  // Chat flow structure – note that name & email steps are removed.
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
      input: true, // Free text input
      next: "submit",
    },
    submit: {
      id: "submit",
      message: "Click the button below to submit your complaint.",
    },
  };

  // State management for chat flow
  const [currentStep, setCurrentStep] = useState(1);
  const [chatLog, setChatLog] = useState([]);
  const [customInput, setCustomInput] = useState("");
  // complaintData holds the complaint type and issue; name and email will be added from userProfile
  const [complaintData, setComplaintData] = useState({
    complaintType: "",
    problem: "",
  });

  // Handle option click from predefined choices
  const handleOptionClick = (option) => {
    const nextStep = option.next;
    // Log user choice and next bot message
    setChatLog((prev) => [
      ...prev,
      { sender: "user", message: option.label },
      { sender: "bot", message: chatSteps[nextStep].message },
    ]);
    // Save complaint type from first step
    if (currentStep === 1) {
      setComplaintData((prev) => ({ ...prev, complaintType: option.label }));
    }
    // For a predefined problem option, update complaint problem and jump to submission step
    if (nextStep === "submit") {
      setComplaintData((prev) => ({ ...prev, problem: option.label }));
    }
    setCurrentStep(nextStep);
  };

  // Handle free text input for step 6
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

  // Final complaint submission
  const handleSubmit = () => {
    const finalData = {
      ...complaintData,
      name: userProfile?.name || "Unknown",
      email: userProfile?.email || "Unknown",
    };

    fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    })
      .then((response) => {
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
        {/* Render chat log */}
        <div className="chat-log">
          {chatLog.map((entry, index) => (
            <div
              key={index}
              className={`chat-message ${entry.sender === "bot" ? "bot-message" : "user-message"}`}
            >
              {entry.message}
            </div>
          ))}
        </div>
        {/* Render input/options */}
        <div className="chat-input">
          {chatSteps[currentStep].options ? (
            chatSteps[currentStep].options.map((option, index) => (
              <button key={index} className="btn btn-primary m-2" onClick={() => handleOptionClick(option)}>
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
      {/* Navigation button */}
      <div className="mt-4 text-center">
        <Link to="/user-complaints" className="btn btn-info">
          View My Complaints
        </Link>
      </div>
    </div>
  );
};

export default Complaints;
