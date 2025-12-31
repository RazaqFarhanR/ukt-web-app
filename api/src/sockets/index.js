const nilaiHandler = require('./nilai');

module.exports = (io) => {
    io.on('connection', (socket) => {
      // console.log(`Connected: ${socket.id}`);
      // console.log(`Total clients: ${io.engine.clientsCount}`);

      nilaiHandler(io, socket);
  
      socket.on('disconnect', () => {
        // console.log(`Disconnected: ${socket.id}`);
        // setTimeout(() => { console.log(`Total clients: ${io.engine.clientsCount}`) }, 1000);
      });
    });

    // io.of('/').adapter.on('create-room', (room) => {
    //   console.log(`📁 Room created: ${room}`);
    // });
    
    // setTimeout(() => {
    //   for (let [id, socket] of io.of('/').sockets) {
    //     console.log(`💥 Disconnecting socket ${id}`);
    //     socket.disconnect(true);
    //   }
    // }, 5000); // delay agar server stabil dulu
};