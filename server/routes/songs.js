const express = require('express');
const router = express.Router();
const { searchSongs, fetchAndParseHTML } = require('../utils/webCrawler');

router.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    console.log('Received search request for:', query);
    const searchResults = await searchSongs(query);
    console.log('Search completed. Sending response.');
    res.json(searchResults);
  } catch (error) {
    console.error('Error in /search route:', error);
    res.status(503).json({ error: 'Error fetching song data from external source', details: error.message });
  }
});


router.get('/song', async (req, res) => {
  const songUrl = req.query.url;
  try {
    console.log('Received request for song details:', songUrl);
    const songData = await fetchAndParseHTML(songUrl);
    res.json(songData);
  } catch (error) {
    console.error('Error in /song route:', error);
    res.status(503).json({ error: 'Error fetching song data from external source', details: error.message });
  }
});


router.get('/parse-html', async (req, res) => {
  const { url } = req.query;
  console.log('Received URL:', url);

  if (!url) {
    console.error('URL is missing in the request');
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log('Attempting to fetch and parse HTML for URL:', url);
    const songTitle = await fetchAndParseHTML(url);

    console.log('Successfully fetched and parsed HTML. Song Title:', songTitle, 'check where finish');
    res.json({ songTitle });
  } catch (error) {
    console.error('Error occurred during fetching or parsing:', error);
    res.status(500).json({ error: 'Error parsing HTML', details: error.message });
  }
});

module.exports = router;