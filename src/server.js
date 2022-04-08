import http from 'http';
import WebSocket from 'ws';
import express from 'express';

const app = express();

//__dirname global

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

//font backend 구분

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log('Listening on http://localhost:3000');

//node제공 http 객체 활용=
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

// function handleConntection(socket) {
//   console.log(socket);
// }

wsServer.on('connection', (socket) => {
  socket.send('testMessage');

  socket.on('close', () => console.log('disconnected browser'));
  socket.on('open', () => console.log('connected browser'));
  socket.on('message', (message) => {
    console.log(message.toString('utf-8'));
  });

  //   socket.on('join_room', (roomName) => {
  //     socket.join(roomName);
  //     socket.to(roomName).emit('welcome');
  //   });
  //   socket.on('offer', (offer, roomName) => {
  //     socket.to(roomName).emit('offer', offer);
  //   });
  //   socket.on('answer', (answer, roomName) => {
  //     socket.to(roomName).emit('answer', answer);
  //   });
  //   socket.on('ice', (ice, roomName) => {
  //     socket.to(roomName).emit('ice', ice);
  //   });
});

server.listen(3000, handleListen);
