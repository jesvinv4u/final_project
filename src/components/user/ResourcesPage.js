import React from "react";
// import Navbar from "../shared/Navbar";
import "./ResourcesPage.css"; // CSS file for custom styling
import { useNavigate } from "react-router-dom"; 

function ResourcesPage(){
  const navigate = useNavigate();
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-5">
      <a className="navbar-brand"> <b>Hostel Hub</b></a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item"><a className="nav-link" href="/home">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/about">About</a></li>
            <li className="nav-item"><a className="nav-link" href="/experiences">Experiences</a></li>
            <li className="nav-item"><a className="nav-link" href="/resources">Resources</a></li>
            <li className="nav-item"><a className="nav-link" href="/contact">Contact</a></li>
          </ul>
        </div>
      </nav>
      {/* User Guide Section */}
      <section className="user-guide-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1>User Guide</h1>
              <p>
                Welcome to Hostel Hub, your one-stop platform for all your hostel needs. With just a few clicks, you can book a room, request a room change, generate an outpass, file a complaint, or request to vacate a room. For admins, easily manage all user requests and ensure a smooth experience for all users.
              </p>
              

            </div>
            <div className="col-md-6">
              <div className="guide-feature mb-4">
                <h5>Change Room Request</h5>
                <p>Need a change of room? Submit your request here, and our team will assist you in finding a suitable alternative according to your preferences.</p>
                <hr />
              </div>
              <div className="guide-feature mb-4">
                <h5>Generate Outpass</h5>
                <p>Generate an outpass quickly and conveniently for your authorized outings. Simply fill in the required details and get your outpass in minutes.</p>
                <hr />
              </div>
              <div className="guide-feature mb-4">
                <h5>Complaints</h5>
                <p>Have a concern or complaint? Let us know, and we'll address it promptly to ensure a comfortable living experience for you and your fellow residents.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section text-center py-5">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <p className="mt-3">
            <img
              src="https://via.placeholder.com/100" // Replace with actual image
              alt="FAQ icon"
              className="mb-3"
            />
          </p>
          
        </div>
        <footer className="text-center mt-5">
          <p>© 2035 by Hostel Hub</p>
        </footer>
      </section>
    </div>
  );
};

export default ResourcesPage;