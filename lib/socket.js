var io = require('socket.io')();

io.on('connection', (socket) => {
  console.log("Socket established with id: " + socket.id);

  socket.on('disconnect', () => {
    console.log("Socket disconnected: " + socket.id);
  });
});

module.exports = io;