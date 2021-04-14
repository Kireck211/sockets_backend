const express = require('express');
const app = express();


const http = require('http').Server(app);

const io = require('socket.io')(http, {
  cors: {
      origins: ['http://localhost:4200']
  }
});

const users = [];

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('login', ({name, room}) => {
    const user = {name, room, id: socket.id};
    console.log('User logged in: ', user.name)
    users.push(user);
    socket.join(user.room);
  });

  socket.on('sendPrivateMessage', msg => {
    const user = users.find(user => user.id === socket.id);
    console.log(user);
    io.in(user.room).emit('privateMessage', msg);
  });

  socket.on('sendGeneralMessage', msg => {
    io.emit('generalMessage', msg);
  })

});

http.listen(3000, () => console.log('listening on port 3000'));

