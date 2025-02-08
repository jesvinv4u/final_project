import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectItem } from "../ui/select";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]); // Store selected files

  // Initialize navigate using useNavigate hook
  const navigate = useNavigate();

  // Retrieve token and userId from localStorage (or adjust to your auth context/props)
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  console.log("Retrieved userId:", userId);


  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  // Submit form data along with uploaded files
  // Submit form data along with uploaded files
const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();

  // Append profile fields
  Object.entries(formData).forEach(([key, value]) => {
    console.log(formData);
    formDataToSend.append(key, value);
  });

  // Append uploaded files if any
  if (files.length > 0) {
    files.forEach((file) => {
      formDataToSend.append("documents", file);
    });
  }

  try {
    let uploadResponseData = { files: [] };
    // Only attempt file upload if files exist
    if (files.length > 0) {
      const uploadResponse = await axios.post("http://localhost:5000/upload", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Files Uploaded:", uploadResponse.data);
      uploadResponseData = uploadResponse.data;
    }

    // Add uploaded file names to profile data (if any)
    const updatedProfile = {
      ...formData,
      documents: uploadResponseData.files,
      status: "old",
    };

    // Send Profile Data to Backend
    const profileResponse = await axios.put(
      `http://localhost:5000/api/user/${userId}/complete-profile`,
      updatedProfile,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Profile Created:", profileResponse.data);
    alert("✅ Profile saved successfully!");
    localStorage.setItem("status", "old");
    navigate("/home");
  } catch (error) {
    console.error("❌ Error saving profile:", error);
  }
};


  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <Card className="max-w-5xl w-full shadow-lg p-6 bg-white rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Hostel Joining & Room Booking
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="name" name="name" onChange={handleChange} required />
              <Input label="Date of Birth" name="dob" type="date" onChange={handleChange} required />
              <Select label="Gender" name="gender" onChange={handleChange}>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </Select>
              <Input label="Nationality" name="nationality" onChange={handleChange} required />
              <Input label="Email ID" name="email" type="email" onChange={handleChange} required />
              <Input label="Contact Number" name="contactNumber" onChange={handleChange} required />
              <Input label="Alternate Contact Number" name="altContact" onChange={handleChange} />
              <Input label="Parent/Guardian Name" name="guardianName" onChange={handleChange} required />
              <Input label="Parent/Guardian Contact Number" name="guardianContact" onChange={handleChange} required />
              <Textarea label="Permanent Address" name="permAddress" onChange={handleChange} required />
              <Textarea label="Correspondence Address" name="corrAddress" onChange={handleChange} />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Academic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Student ID / Roll Number" name="studentID" onChange={handleChange} required />
              <Input label="Course Name" name="course" onChange={handleChange} required />
              <Input label="Year/Semester" name="year" onChange={handleChange} required />
              <Input label="Department" name="department" onChange={handleChange} required />
              <Input label="University/College Name" name="university" onChange={handleChange} required />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Hostel & Room Preferences</h3>
            <Input label="Hostel Block/Building Preference" name="hostelPreference" onChange={handleChange} />
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Emergency Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Blood Group" name="bloodGroup" onChange={handleChange} required />
              <Textarea label="Medical Conditions (if any)" name="medical" onChange={handleChange} />
              <Textarea label="Allergies" name="allergies" onChange={handleChange} />
              <Input label="Emergency Contact Name" name="emergencyName" onChange={handleChange} required />
              <Input label="Emergency Contact Number" name="emergencyContact" onChange={handleChange} required />
              <Input label="Health Insurance Details" name="insurance" onChange={handleChange} />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Documents Upload</h3>
            <div className="space-y-4">
              <input type="file" multiple onChange={handleFileChange} />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Declaration & Agreement</h3>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="agreement" required />
              <span>I acknowledge the hostel rules & regulations.</span>
            </label>
            <br />
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="parentConsent" />
              <span>Consent from Parent/Guardian (if required).</span>
            </label>
          </CardContent>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
