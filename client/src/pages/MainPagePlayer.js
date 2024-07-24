import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import '../styles/MainPagePlayer.css';

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

const MainPagePlayer = () => {
  const [message, setMessage] = useState('Waiting for next song...');
  const [songSelected, setSongSelected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  useEffect(() => {
    socket.connect();

    const handleSongSelected = (data) => {
      console.log('Song selected event received:', data.song.songData.songTitle);
      setSongSelected(true);
      setMessage(`Song selected: ${data.song.songData.songTitle}`);
      console.log('User:', user);
      navigate('/live', { state: { songData: data.song.songData, user: user } });
    };

    socket.on('songSelected', handleSongSelected);

    return () => {
      socket.off('songSelected', handleSongSelected);
      socket.disconnect();
    };
  }, [navigate, user]);

  // Welcome greeting message based on user data
  const welcomeMessage = user ? `Welcome, ${user.username}!` : 'Welcome!';

  return (
    <div className="container">
      <h1 className="title">JaMoveo</h1>
      <div className="welcome-message">
        <p>{welcomeMessage}</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default MainPagePlayer;
