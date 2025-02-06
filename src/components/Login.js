import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Prevent multiple clicks
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // ✅ Disable button during request

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      const data = await response.json();
      console.log("📌 Login Response:", data); // ✅ Debugging output

      if (response.ok) {
        localStorage.setItem("token", data.token); // ✅ Store JWT token
        localStorage.setItem("role", data.user.role); // ✅ Store user role
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Store user details
        
        alert(`✅ Welcome, ${data.user.name}!`);

        // ✅ Redirect based on role and profile completion status
        if (data.user.status === "new") {
          navigate('/profile'); // 🚀 Navigate new users to profile page
        } else if (data.user.role === "admin") {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.message || '❌ Invalid email or password');
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      setError('❌ Server error, please try again later.');
    } finally {
      setLoading(false); // ✅ Re-enable button
    }
  };

  return (
    <div className="login-container">
      <div className="floating-emojis">
        <span>🏀</span>
        <span>⚽</span>
        <span>🎓</span>
        <span>🏠</span>
        <span>📚</span>
      </div>
      
      <div className="login-box">
        <div className="login-header">
          <h1>🎓 Campus Connect 🏠</h1>
          <p>Your Gateway to Hostel Life & Sports 🏆</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>📧 Email:</label>
            <input
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              placeholder="student@campus.edu"
              required
            />
          </div>
          
          <div className="input-group">
            <label>🔑 Password:</label>
            <input
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && <div className="error-message">🚨 {error}</div>}
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "⏳ Logging in..." : "🚪 Login"}
          </button>
          
        </form>
        
        <div className="login-footer">
          <p>🧠 Forgot Password? <Link to="/reset">Reset Here</Link></p>
          <p>👋 New Student? <Link to="/signup">Join Our Community</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
