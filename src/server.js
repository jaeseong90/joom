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
wsServer.en;
// function handleConntection(socket) {
//   console.log(socket);
// }

const sockets = [];

wsServer.on('connection', (socket) => {
  socket.send('testMessage');
  socket['nick'] = 'Anon';

  sockets.push(socket);

  socket.on('close', () => console.log('disconnected browser'));

  socket.on('message', (message) => {
    const parsed = JSON.parse(message);
    console.log(parsed);

    switch (parsed.type) {
      case 'new_message':
        sockets.forEach((socketItem) => socketItem.send(`${socket['nick']} : ${parsed.payload}`));
      case 'nick':
        socket['nick'] = parsed.payload;
    }
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
