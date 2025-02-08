import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/user/Homepage";
import Adminhome from "./components/admin/Adminhome";
import RoomAllocation from "./components/admin/RoomAllocation";
import OutpassData from './components/admin/OutpassData';
import ComplaintsPage from "./components/admin/ComplaintsPage";
import VacateRequest from "./components/admin/VacateRequest";
// import AdminTickets from "./components/admin/AdminTickets";
// import UserProfile from "./components/user/Profile";
// import Outpass from "./components/admin/Outpass";
import AboutPage from "./components/user/AboutPage";
import ExperiencesPage from "./components/user/ExperiencesPage";
import ResourcesPage from "./components/user/ResourcesPage";
import ContactPage from "./components/user/ContactPage";
import BookRoom from "./components/user/BookRoom";
import ChangeRoom from "./components/user/ChangeRoom";
import GenerateOutPass from "./components/user/GenerateOutPass";
import Complaints from "./components/user/Complaints";
import VacateRoom from "./components/user/VacateRoom";

import Profile from "./components/user/Profile"; // Adjust path if needed
import ProfileView from "./components/user/profileview"; // Adjust path if needed



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