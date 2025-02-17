import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectItem } from "../ui/select";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/upload");
        setUploadedFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    files.forEach((file) => {
      formDataToSend.append("documents", file);
    });
    try {
      const profileResponse = await axios.put(
        `http://localhost:5000/api/user/${userId}/complete-profile`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );
      alert("✅ Profile saved successfully!");
      localStorage.setItem("status", "old");
      navigate("/home");
    } catch (error) {
      console.error("❌ Error saving profile:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 p-8">
      <Card className="max-w-5xl w-full shadow-lg p-6 bg-white rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Hostel Joining & Room Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" name="name" onChange={handleChange} required />
              <Input label="Date of Birth" name="dob" type="date" onChange={handleChange} required />
              <Select label="Gender" name="gender" onChange={handleChange}>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </Select>
              <Input label="Nationality" name="nationality" onChange={handleChange} required />
              <Input label="Email ID" name="email" type="email" onChange={handleChange} required />
              <Input label="Contact Number" name="contactNumber" onChange={handleChange} required />
              <Input label="Parent/Guardian Name" name="guardianName" onChange={handleChange} required />
              <Input label="Parent/Guardian Contact" name="guardianContact" onChange={handleChange} required />
              <Textarea label="Permanent Address" name="permAddress" onChange={handleChange} required />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Academic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Student ID" name="studentID" onChange={handleChange} required />
              <Input label="Course Name" name="course" onChange={handleChange} required />
              <Input label="Department" name="department" onChange={handleChange} required />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Emergency Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Blood Group" name="bloodGroup" onChange={handleChange} required />
              <Textarea label="Medical Conditions" name="medical" onChange={handleChange} />
              <Input label="Emergency Contact" name="emergencyContact" onChange={handleChange} required />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Documents Upload</h3>
            <div className="space-y-4">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
              />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Declaration</h3>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="agreement" required />
              <span>I acknowledge the hostel rules & regulations</span>
            </label>
          </CardContent>

          <div className="flex justify-center">
            <Button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Submit Application
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
