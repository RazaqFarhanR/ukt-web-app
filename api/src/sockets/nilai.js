module.exports = (io, socket) => {
    socket.on('join_event', ({ role, event_id }) => {
        const room = `${role}_event_${event_id}`;
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
      });

    socket.on('submit_nilai', ({ event_id}) => {
        console.log(`> Nilai masuk untuk event ${event_id}`);

      const room = `pengurus_event_${event_id}`;
      io.to(room).emit('update_rekap');
    });
  };
  