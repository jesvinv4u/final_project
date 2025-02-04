import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Use navigate for redirection
import './Signup.css';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Prevent multiple submissions
  const navigate = useNavigate(); // ✅ Use to redirect after successful signup

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  // ✅ Make handleSignup an async function
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (signupInfo.password !== signupInfo.confirmPassword) {
      setError("🔒 Passwords don't match!");
      return;
    }

    setLoading(true); // ✅ Prevent multiple clicks
    setError(''); // ✅ Clear previous errors

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', { // ✅ Corrected API URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupInfo.email.split("@")[0], // Extract name from email
          email: signupInfo.email,
          password: signupInfo.password,
          role: "user",
        }),
      });

      const data = await response.json();
      console.log("📌 Registration Response:", data); // ✅ Debugging output

      if (response.ok) {
        alert('✅ Registration Successful! Redirecting to login...');
        navigate('/'); // ✅ Redirect user to login page
      } else {
        setError(data.message || '❌ Registration failed.');
      }
    } catch (error) {
      console.error("❌ Signup Error:", error);
      setError('❌ Failed to register. Please try again.');
    } finally {
      setLoading(false); // ✅ Enable button again
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup}>
        <input
          type="email"
          name="email"
          value={signupInfo.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />
        <input
          type="password"
          name="password"
          value={signupInfo.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          value={signupInfo.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
        />
        
        {error && <div className="error-message">🚨 {error}</div>}

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "⏳ Registering..." : "🎓 Create Account"}
        </button>

        <p>🏠 Already have an account? <Link to="/">Login Here</Link></p>
      </form>
    </div>
  );
}

export default Signup;
