import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupInfo.password !== signupInfo.confirmPassword) {
      setError("🔒 Passwords don't match!");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupInfo.email.split("@")[0], // Extract name from email
          email: signupInfo.email,
          password: signupInfo.password,
          role: "user",
          dob: "none",
          gender: "none",
          nationality: "none",
          contactNumber: "none",
          guardianName: "none",
          guardianContact: "none",
          permAddress: "none",
          studentID: "none",
          course: "none",
          department: "none",
          year: "none",
          bloodGroup: "none",
          medical: "none",
          emergencyContact: "none",
        }),
      });

      const data = await response.json();
      console.log("📌 Registration Response:", data);

      if (response.ok) {
        alert('✅ Registration Successful! Redirecting to login...');
        navigate('/');
      } else {
        setError(data.message || '❌ Registration failed.');
      }
    } catch (error) {
      console.error("❌ Signup Error:", error);
      setError('❌ Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join us today!</p>
        </div>
        <form onSubmit={handleSignup}>
        <div className="password-section">

          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={signupInfo.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={signupInfo.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            <div className="input-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={signupInfo.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>
          </div>

          <div className="terms-section">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree to the Terms and Conditions</label>
          </div>

          {error && <div className="error-message">🚨 {error}</div>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "⏳ Registering..." : "🎓 Create Account"}
          </button>
        </form>

        

        <div className="signup-footer">
          <p>
            🏠 Already have an account? <Link to="/">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
