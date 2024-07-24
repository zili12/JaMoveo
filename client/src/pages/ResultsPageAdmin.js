import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import '../styles/ResultsPageAdmin.css';

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

const ResultsPageAdmin = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fixedRehearsalId = 'test_rehearsal_id';
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  useEffect(() => {
    socket.connect();
    if (location.state?.searchResults) {
      setSearchResults(location.state.searchResults);
    } else {
      setErrorMessage('No search results found. Please perform a search from the main page.');
    }
    return () => {
      socket.disconnect();
    };
  }, [location.state]);

  const handleSelectSong = async (songId) => {
    const selectedSong = searchResults.find(result => result.id === songId);
    if (!selectedSong) {
      console.error('Song not found in search results.');
      return;
    }
    
    const songUrl = selectedSong.url;
    
    try {
      const response = await axios.get(`/api/songs/parse-html`, { params: { url: songUrl } });
      const songData = response.data;
  
      socket.emit('adminSelectSong', { songData, rehearsalId: fixedRehearsalId });
  
      navigate('/live', { state: { songData, user: user } });
    } catch (error) {
      console.error('Error fetching song data for song URL:', songUrl, error);
      setErrorMessage('Failed to select song. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="header">Search Results</h1>
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      <div className="results-container">
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div key={result.id} className="result-item">
              <img 
                src={result.image} 
                alt={result.title} 
                className="result-image" 
              />
              <button
                onClick={() => handleSelectSong(result.id)}
                className="result-button"
              >
                {result.title} - {result.artist}
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No results found. Please perform a search from the main page.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsPageAdmin;
