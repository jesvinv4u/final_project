import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

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

    try {
      const response = await fetch('/api/auth/register', { // ✅ 'await' works inside async function
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

      if (response.ok) {
        alert('✅ Registration Successful!');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('❌ Failed to register.');
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

        <button type="submit" className="signup-button">🎓 Create Account</button>

        <p>🏠 Already have an account? <Link to="/">Login Here</Link></p>
      </form>
    </div>
  );
}

export default Signup;
