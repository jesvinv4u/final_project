import React from "react";
import "./ExperiencesPage.css"; // CSS file for custom styling

function ExperiencesPage(){
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
      

      {/* Student and Admin Access Section */}
      <section className="access-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1>Student and Admin Access</h1>
              <p>
                Students and admins can easily log in and access the features provided. Students can book rooms, request room changes, generate outpasses, submit complaints, and request to vacate rooms, while admins can manage all user requests efficiently.
              </p>
              

            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card p-3 shadow-sm">
                    <h5>Change Room Request</h5>
                    <p>Share your feature information here to attract new clients.</p>
                    <a href="#more">Show More</a>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card p-3 shadow-sm">
                    <h5>Generate Outpass</h5>
                    <p>Share your feature information here to attract new clients.</p>
                    <a href="#more">Show More</a>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card p-3 shadow-sm">
                    <h5>Submit Complaints</h5>
                    <p>Share your feature information here to attract new clients.</p>
                    <a href="#more">Show More</a>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card p-3 shadow-sm">
                    <h5>Vacate Room Request</h5>
                    <p>Share your feature information here to attract new clients.</p>
                    <a href="#more">Show More</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Living Images Section */}
      <section className="living-images-section text-center py-5">
        <div className="container">
          <h2>Campus Living Images</h2>
          <p>
            Explore our gallery featuring images of the hostel campus, rooms, common areas, and facilities to get a glimpse of the comfortable living spaces we offer to students.
          </p>
          <div className="carousel-container">
            <div className="carousel">
              <div className="carousel-item active">
                <div className="image-placeholder bg-light"></div>
              </div>
              <div className="carousel-item">
                <div className="image-placeholder bg-light"></div>
              </div>
            </div>
          </div>
        </div>
        <footer className="text-center mt-5">
          <p>© 2035 by Hostel Hub</p>
        </footer>
      </section>
    </div>
  );
};

export default ExperiencesPage;