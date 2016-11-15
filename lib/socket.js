var io = require('socket.io')();

io.on('connection', function(socket){
  console.log("Socket established with id: " + socket.id);

  socket.on('disconnect', function () {
    console.log("Socket disconnected: " + socket.id);
  });
});

module.exports = io;