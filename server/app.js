const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/rehearsals', require('./routes/rehearsals'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Check if the error is from the web crawler
  if (err.message.includes('web crawling error')) {

    const axios = require('axios');

     axios.get('https://www.tab4u.com')
    .then(response => console.log('Tab4U is accessible'))

  .catch(error => console.error('Error accessing Tab4U:', error.message));
    return res.status(503).json({ error: 'Error fetching song data from external source' });
  }
  
  // Handle other types of errors
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

module.exports = app;