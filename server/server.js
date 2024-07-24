const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const setupSocket = require('./utils/socket');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

setupSocket(io);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  if (res.headersSent) {
    return next(err);
  }
  
  if (err.message.includes('web crawling error')) {
    return res.status(503).json({ error: 'Error fetching song data from external source' });
  }
  
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});