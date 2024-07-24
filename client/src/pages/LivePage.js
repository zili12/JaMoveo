import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

const LivePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const songData = location.state?.songData;
  const user = location.state?.user;
  const [isScrolling, setIsScrolling] = useState(false);

  // Function to determine if text is RTL
  const isRTL = (text) => {
    const rtlLanguages = /[\u0600-\u06FF\u0700-\u08FF\u0590-\u05FF]/;
    return rtlLanguages.test(text);
  };

  useEffect(() => {
    socket.connect();
    console.log('Location state:', location.state);
    console.log('Fetched song data:', songData); 
    console.log('User:', user);
    
    // Listen for 'quit' event from the server
    socket.on('quit', () => {
      if (user?.isAdmin) {
        console.log('Admin quit the song');
        navigate('/main-admin', { state: { user } });
      } else {
        console.log('User quit the song');
        navigate('/main', { state: { user } });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate, location.state, songData, user]);

  useEffect(() => {
    let scrollInterval;
    if (isScrolling) {
      // Adjust the interval and scroll amount as needed
      scrollInterval = setInterval(() => {
        window.scrollBy(0, 1); // Amount of scroll per interval (in pixels)
      }, 100); // Interval between scrolls (in milliseconds)
    } else {
      clearInterval(scrollInterval);
    }

    return () => clearInterval(scrollInterval);
  }, [isScrolling]);

  if (!songData) {
    return <div>No song data available.</div>;
  }
 
  const title = songData?.songTitle?.title || 'Unknown Title';
  const artist = songData?.songTitle?.artist || 'Unknown Artist';
  const lyricsAndChords = songData?.songTitle?.lyricsAndChords || [];

  const handleQuit = () => {
    if (user?.isAdmin) {
      console.log('Admin quit the song');
      socket.emit('quit');
    }
  };

  const toggleScrolling = () => {
    setIsScrolling(prev => !prev);
  };

  const isTitleRTL = isRTL(title);
  const isArtistRTL = isRTL(artist);
  const isLyricsRTL = lyricsAndChords.some(item => isRTL(item.lyrics));

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Song Details</h1>
      <div style={{ ...styles.songDetail, direction: isTitleRTL ? 'rtl' : 'ltr' }}>
        <strong>Title:</strong> {title}
      </div>
      <div style={{ ...styles.songDetail, direction: isArtistRTL ? 'rtl' : 'ltr' }}>
        <strong>Artist:</strong> {artist}
      </div>
      <div style={styles.songDetail}>
        <strong>Lyrics and Chords:</strong>
        {lyricsAndChords.length > 0 ? (
          lyricsAndChords.map((item, index) => (
            <div key={index} style={{ ...styles.line, direction: isLyricsRTL ? 'rtl' : 'ltr' }}>
              {user?.instrument !== 'vocals' && <span style={styles.chords}>{item.chords}</span>}
              <span style={styles.lyrics}>{item.lyrics}</span>
            </div>
          ))
        ) : (
          <div>No lyrics and chords data available.</div>
        )}
      </div>
      {user?.isAdmin && (
        <button onClick={handleQuit} style={styles.button}>Quit</button>
      )}
      <button
        onClick={toggleScrolling}
        style={styles.toggleButton}
      >
        {isScrolling ? 'Stop Scrolling' : 'Start Scrolling'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  songDetail: {
    marginBottom: '10px',
    fontSize: '18px',
    color: '#555',
  },
  line: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '5px',
  },
  chords: {
    fontWeight: 'bold',
    color: '#444',
  },
  lyrics: {
    marginLeft: '10px',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  toggleButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#FF5722',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  }
};

export default LivePage;