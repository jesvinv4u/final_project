import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import HomePage from "./components/user/Homepage.js";
import Adminhome from "./components/admin/Adminhome.js";
import RoomAllocation from "./components/admin/RoomAllocation.js";
import OutpassData from './components/admin/OutpassData.js';
import ComplaintsPage from "./components/admin/ComplaintsPage.js";
import VacateRequest from "./components/admin/VacateRequest.js";
import AboutPage from "./components/user/AboutPage.js";
import ExperiencesPage from "./components/user/ExperiencesPage.js";
import ResourcesPage from "./components/user/ResourcesPage.js";
import ContactPage from "./components/user/ContactPage.js";
import BookRoom from "./components/user/BookRoom.js";
import ChangeRoom from "./components/user/ChangeRoom.js";
import GenerateOutPass from "./components/user/GenerateOutPass.js";
import Complaints from "./components/user/Complaints.js";
import VacateRoom from "./components/user/VacateRoom.js";
import Profile from "./components/user/Profile.js";
import ProfileView from "./components/user/profileview.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/bookroom" element={<BookRoom />} />
        <Route path="/changeroom" element={<ChangeRoom />} />
        <Route path="/outpass" element={<GenerateOutPass />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/vacate" element={<VacateRoom />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profileview" element={<ProfileView />} />


        {/* Admin Routes */}
        <Route path="/admin" element={<Adminhome />} />
        <Route path="/room-allocation" element={<RoomAllocation />} />
        <Route path="/outpass-data" element={<OutpassData />} />
        <Route path="/complaints-page" element={<ComplaintsPage />} />
        <Route path="/vacate-request" element={<VacateRequest />} />

        {/* <Route path="/admin-tickets" element={<AdminTickets />} />
        <Route path="/admin-outpass" element={<Outpass />} /> */}

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;