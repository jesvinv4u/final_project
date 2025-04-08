import React from "react";
import "./ContactPage.css"; // CSS file for custom styling

function ContactPage() {
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
      

      {/* Get in Touch Section */}
      <section className="get-in-touch-section py-5">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>
            For any inquiries or assistance, feel free to reach out to us. We are here to help you with all your hostel needs.
          </p>
          <p><strong>Address</strong></p>
          <p><a href="#contact">Contact</a></p>
          <p>Support</p>
        </div>
      </section>

      {/* Contact Us Today Section */}
      <section className="contact-us-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2>Contact Us Today</h2>
              <p>Complete the form below to get in touch with us. We will respond to your inquiry as soon as possible.</p>
            </div>
            <div className="col-md-6">
              {/* Placeholder for form or other content */}
              <div className="form-placeholder bg-light"></div>
            </div>
          </div>
          <footer className="text-center mt-5">
            <h3>Send Message</h3>
            <div className="d-flex justify-content-around mt-3">
              <span>Details</span>
              <span>Name</span>
              <span>Message Here</span>
            </div>
            <p className="mt-4">© 2035 by Hostel Hub</p>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;