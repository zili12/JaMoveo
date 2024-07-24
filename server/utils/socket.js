const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle song selection by admin
    socket.on('adminSelectSong', (data) => {
      console.log('Admin selected song:', data);
      // Broadcast the selected song to all connected clients
      io.emit('songSelected', { song: data, selectedBy: 'admin' });
    });

    socket.on('quit', () => {
      console.log('admin click Quit');
      // Broadcast the 'quit' event to all connected clients
      io.emit('quit');
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

module.exports = setupSocket;