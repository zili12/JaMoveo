const axios = require('axios');
const cheerio = require('cheerio');

async function searchSongs(query) {
  try {
    const url = `https://www.tab4u.com/resultsSimple?tab=songs&q=${(query)}`;
    console.log('1: Fetching from URL:', url);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10 seconds timeout
    });

    console.log('Response status:', response.status);

    const $ = cheerio.load(response.data);
    
    const results = [];
    $('.ruSongUnit').each((i, elem) => {
      if (i < 5) { // Limit to top 5 results
        const songLink = $(elem).find('.ruSongLink');
        const title = songLink.find('.sNameI19').text().trim().replace(' /', '');
        const artist = songLink.find('.aNameI19').text().trim();
        const href = songLink.attr('href');
        //const image = $(elem).find('.ruImgI19 img').attr('src'); // Scrape image URL
        let url = `https://www.tab4u.com${href}`;

        // add slash between com and tabs
        url = url.replace('comtabs', 'com/tabs');

          // Extract image URL from the style attribute of the span
          const imageSpan = $(elem).find('.ruArtPhoto');
          const style = imageSpan.attr('style');
          const imageUrlMatch = style && style.match(/url\(([^)]+)\)/);
          const image = imageUrlMatch ? `https://www.tab4u.com${imageUrlMatch[1]}` : '';

          console.log('image url:', image);


        const id = i; // Generate a numeric ID
        results.push({ id, title, artist, url, image });
      }
    });
    console.log('results array:', results);
    console.log('Found', results.length, 'results');
    
    if (results.length === 0) {
      console.log('No results found. HTML content:', response.data);
    }

    return results;
  } catch (error) {
    console.error('Error in searchSongs:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw new Error(`Failed to fetch search results: ${error.message}`);
  }
}
async function fetchAndParseHTML(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const songTitle = $('h1').first().text().trim();
    const artist = $('h2').first().text().trim();

    const lyricsAndChords = [];
    $('table').each((_, table) => {
      $(table).find('tr').each((_, row) => {
        // Try to get English chords
        let chords = $(row).find('.chords_en').text().trim();
        
        // If no English chords, try to get Hebrew chords
        if (!chords) {
          const chordElements = $(row).find('.chords span');
          chords = chordElements.map((_, el) => {
            const onmouseover = $(el).attr('onmouseover');
            if (onmouseover) {
              const match = onmouseover.match(/sCI\('([^']+)'/);
              return match ? match[1] : '';
            }
            return '';
          }).get().join(' ').trim();
        }
        
        const lyrics = $(row).find('.song').text().trim();
        if (chords || lyrics) {
          lyricsAndChords.push({ chords, lyrics });
        }
      });
    });

    return {
      title: songTitle,
      artist: artist,
      lyricsAndChords: lyricsAndChords
    };
  } catch (error) {
    console.error('Error fetching or parsing HTML:', error);
    throw new Error(`Failed to fetch and parse HTML: ${error.message}`);
  }
}

module.exports = { searchSongs, fetchAndParseHTML };
