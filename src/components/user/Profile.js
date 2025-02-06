import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectItem } from "../ui/select";
import { Upload } from "../ui/upload";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData); // ✅ Store submitted data for preview
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <Card className="max-w-5xl w-full shadow-lg p-6 bg-white rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Hostel Joining & Room Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" name="fullName" onChange={handleChange} required />
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
              <Upload label="Student ID Card (if available)" />
              <Upload label="Admission Letter" />
              <Upload label="Address Proof (Aadhar/Passport/Voter ID)" />
              <Upload label="Recent Passport-size Photos" />
              <Upload label="Parent/Guardian ID Proof" />
            </div>
          </CardContent>

          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Declaration & Agreement</h3>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="agreement" required />
              <span>I acknowledge the hostel rules & regulations.</span>
            </label>
            <br></br>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="parentConsent" />
              <span>Consent from Parent/Guardian (if required).</span>
            </label>
          </CardContent>

          <div className="flex justify-center">
            <Button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Submit Application
            </Button>
          </div>
        </form>
      </Card>

      {/* ✅ Display Preview of Submitted Data */}
      {submittedData && (
        <Card className="max-w-5xl w-full shadow-lg p-6 bg-white rounded-2xl mt-8">
          <h2 className="text-2xl font-bold text-center mb-6">Submission Preview</h2>
          <div className="space-y-4">
            {Object.entries(submittedData).map(([key, value]) => (
              <p key={key} className="text-gray-700">
                <strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> {value}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
