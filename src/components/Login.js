import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginInfo.email,
          password: loginInfo.password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token); // ✅ Store JWT token
        localStorage.setItem("role", data.user.role); // ✅ Store role
  
        // Redirect based on role
        if (data.user.role === "admin") {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.message || '❌ Invalid email or password');
      }
    } catch (error) {
      setError('❌ Server error, please try again later.');
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
          
          <button type="submit" className="login-button">
            🚪 Login
          </button>
          
          <div className="social-login">
            <button type="button" className="google-btn">
              🅖 Continue with Google
            </button>
            <button type="button" className="microsoft-btn">
              Ⓜ️ Continue with Microsoft
            </button>
          </div>
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