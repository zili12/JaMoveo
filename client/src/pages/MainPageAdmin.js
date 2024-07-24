import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/MainPageAdmin.css';

const MainPageAdmin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const handleSearch = async () => {
    try {
      setErrorMessage('');
      const response = await axios.get(`/api/songs/search`, { params: { query: searchQuery } });
      // Navigate to the results page with the search results
      console.log('MainPageAdmin: Search results:', response.data);
      navigate('/results', { state: { searchResults: response.data, user: user } });
    } catch (error) {
      console.error('Error searching for songs:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to search for songs. Please try again later.');
    }
  };

  // Function to determine if text is RTL
  const isRTL = (text) => {
    const rtlLanguages = /[\u0600-\u06FF\u0700-\u08FF\u0590-\u05FF]/;
    return rtlLanguages.test(text);
  };

  return (
    <div className="main-page-admin">
      <h1 className="title">Search any song...</h1>
      {user && <p className="greeting">Welcome, {user.username}!</p>}
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a song..."
          className={`search-input ${isRTL(searchQuery) ? 'rtl' : ''}`}
          style={{ textAlign: isRTL(searchQuery) ? 'right' : 'left' }}
        />
        <button
          onClick={handleSearch}
          className="search-button"
        >
          Search
        </button>
      </div>
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default MainPageAdmin;
