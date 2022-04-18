//import WebSocket from 'ws';
import http from 'http';
import express from 'express';
import { SocketIO, Server } from 'socket.io';

const app = express();
const { instrument } = require('@socket.io/admin-ui');

//__dirname global
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

//node제공 http 객체 활용
const httpServer = http.createServer(app);
//const socketIOServer = SocketIO(httpServer);

const socketIOServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(socketIOServer, {
  auth: false,
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = socketIOServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return socketIOServer.sockets.adapter.rooms.get(roomName)?.size;
}

socketIOServer.on('connection', (socket) => {
  socket.onAny((event) => {
    console.log(`socket event : ${event} `);
  });

  //모든 소켓에 대한 정보까지 다 있는 socket 파라미터로 넘어옴
  //console.log(socket);
  socket['nickName'] = 'Anno';
  socketIOServer.sockets.emit('room_change', publicRooms());

  socket.on('room_enter', (payload, clientCallback) => {
    socket.join(payload.roomName);
    clientCallback();
    socket.to(payload.roomName).emit('welcome', socket['nickName']);
    socketIOServer.sockets.emit('room_change', publicRooms());
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('bye', socket['nickName']);
    });
  });

  socket.on('disconnect', () => {
    socketIOServer.sockets.emit('room_change', publicRooms());
  });

  socket.on('new_message', (payload, clientCallback) => {
    socket.to(payload.roomName).emit('new_message', `${socket['nickName']} : ${payload.message}`);
    clientCallback();
  });

  socket.on('nickName', (payload, clientCallback) => {
    socket['nickName'] = payload.nickName;
    clientCallback();
  });
});

// const sockets = []; //const wsServer = new WebSocket.Server({ server });
// wsServer.on('connection', (socket) => {
//   socket.send('testMessage');
//   socket['nick'] = 'Anon';
//   sockets.push(socket);
//   socket.on('close', () => console.log('disconnected browser'));
//   socket.on('message', (message) => {
//     const parsed = JSON.parse(message);
//     console.log(parsed);
//     switch (parsed.type) {
//       case 'new_message':
//         sockets.forEach((socketItem) => socketItem.send(`${socket['nick']} : ${parsed.payload}`));
//       case 'nick':
//         socket['nick'] = parsed.payload;
//     }
//   });
// });

httpServer.listen(3000, console.log('Listening on http://localhost:3000'));
