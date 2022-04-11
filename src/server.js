//import WebSocket from 'ws';
import http from 'http';
import express from 'express';
import SocketIO from 'socket.io';

const app = express();

//__dirname global
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

//node제공 http 객체 활용
const httpServer = http.createServer(app);
const socketIOServer = SocketIO(httpServer);

socketIOServer.on('connection', (socket) => {
  socket.onAny((event) => {
    console.log(`socket event : ${event} `);
  });

  //모든 소켓에 대한 정보까지 다 있는 socket 파라미터로 넘어옴
  //console.log(socket);
  socket.on('room_enter', (msg, clientCallback) => {
    socket.join(msg.payload);
    clientCallback();
  });

  socket.on('room_leave', (msg, clientCallback) => {
    socket.leave(msg.payload);
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
