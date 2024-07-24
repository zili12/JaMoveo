import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'; // Import the CSS file

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        instrument
      });
      console.log(response.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="signup-page">
      <h1 className="app-title">JaMoveo</h1>
      <div className="signup-container">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="instrument">Instrument:</label>
            <select
              id="instrument"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              required
            >
              <option value="">Select an instrument</option>
              <option value="drums">Drums</option>
              <option value="guitars">Guitars</option>
              <option value="bass">Bass</option>
              <option value="saxophone">Saxophone</option>
              <option value="keyboards">Keyboards</option>
              <option value="vocals">Vocals</option>
            </select>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
