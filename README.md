# joom
zoom clone (from 노마드 코더)

## 1. 개발환경준비 및 서버 셋팅
- 윈도우로 진행했음

디렉토리 생성하고 npm 개발준비 및 깃 연결
```
mkdir joom
cd mkdir
npm init -y
git init
git config user.name "jaeseong"
git config user.email "woavldsj12@gmail.com"
git add package.json
git commit -m "init"
git branch -M main
git remote add origin https://github.com/jaeseong90/joom.git
git push -u origin main
```

.gitignore 파일생성 
/node_modules 추가

nodemon 설치
```
npm i nodemon -D
```
우리 프로그램의 변경사항을 확인하여 서버를 재시작하여주는 프로그램

- babel.config.json 파일 생성
- nodemon.json 파일 생성
- src 디렉토리 생성
- src 디렉토리 server.js 파일 생성

server.js
```
console.log('hello world!!');
```

바벨 설치 
```
 npm i @babel/core @babel/cli @babel/node -D
```

nodemon.json
```
{
  "ignore": ["src/public/*"],
  "exec":"babel-node src/server.js"
}
```
서버를 재시작하는 대신에 바벨노드 시작
바벨은 소스코드를 일반 NodeJS 코드로 변환
다른 JS 수정할때 재시작 방지

babel.config.json
```
{
    "presets": ["@babel/preset-env"]
}
```

babel/preset-env 설치
```
npm i @babel/preset-env -D
```

package.json 추가
```
  "scripts": {
    "dev":"nodemon"
  },
```

실행 확인
```
>yarn dev
yarn devyarn run v1.22.4
$ nodemon
[nodemon] 2.0.15
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `babel-node src/server.js`
hello world!!
```
npm 설치
```
npm i express
```

## 2. FrontEnd Setup
- pug 설치
```
yarn add pug
```

- /src/publicjs/app.js
```
hello
```

- /src/views/home.pug (html 하면 내용 자동완성)
```
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Joom
        link(rel="stylesheet", href="https://unpkg.com/mvp.css")
    body 
        header Joom
            h1 It works! 
        main 
            h2 
        button  call  
        script(src="/public/js/app.js") 
```

- mvp css 너무 엉망으로 보이지 않기위한 최소한의 스타일 추가 

-server.js 수정
```
import express from 'express';

const app = express();

//__dirname global

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
//js, css 파일들 접근

app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));
//home만 사용할테니 다 막음

const handleListen = () => console.log('Listening on http://localhost:3000');

app.listen(3000, handleListen);
```

## 3. websocket in nodejs
- ws 라는 node package 활용
```
yarn add ws
```
- express 는 http 다룸 
- ws는 별도 
- http와 ws 다 연결하기때문에 server.js 수정하여 진행
```
import http from 'http';
import WebSocket from 'ws';

const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });
server.listen(3000, handleListen);
```

## 4. Websocket 

- 웹소켓 이벤트 (server.js)
```
wsServer.on('connection', (socket) => {
  //console.log(socket);
  socket.send('testMessage');

  socket.on('close', () => console.log('disconnected browser'));
  socket.on('open', () => console.log('connected browser'));
  socket.on('message', (message) => {
    console.log(message.toString('utf-8'));
  });
})

```


- app.js 웹소켓 연결해보자
```
var socket = new WebSocket("ws://localhost:3000");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log(`Connected to Server ⭕`);
});

socket.addEventListener('message', (message) => {
  console.log(`just got this`, message, 'from server');
  console.log(message.data);
});

socket.addEventListener('close', (ev) => {
  console.log('Connected from Server ❌');
});

socket.addEventListener('error', (ev) => {
  console.log(ev);
});

setTimeout(() => {
  socket.send('hello server');
}, 1000);
```

## 5. Websocket 을 활용한 간단한 채팅 구현
server.js
``` 
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
});

server.listen(3000, handleListen);

```

app.js
```
const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nickForm');
const messageForm = document.querySelector('#messageForm');

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
  console.log(`Connected to Server ⭕`);
});

socket.addEventListener('message', (message) => {
  console.log(`just got this`, message, 'from server');

  const el = document.createElement('li');
  el.innerHTML = message.data;

  messageList.appendChild(el);
});

socket.addEventListener('close', (ev) => {
  console.log('Connected from Server ❌');
});

socket.addEventListener('error', (ev) => {
  console.log(ev);
});

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function parseMessage() {}

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const input = messageForm.querySelector('input');
  socket.send(makeMessage('new_message', input.value));

  input.value = '';
});

nickForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nick', input.value));
  input.value = '';
});
```

home.pug
```
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Joom
        link(rel="stylesheet", href="https://unpkg.com/mvp.css")
    body 
        header Joom
            h1 It works! 
        main 
            ul
            form#nickForm
                input(placeholder="nick" type="text", requerid)
                button Enter
            form#messageForm
                input(placeholder="message" type="text", requerid)
                button Enter
        
        script(src="/public/js/app.js") 
```

## 6. SocketIO
- SocketIO 는 실시간 양방향 통신 프레임워크
- 웹소켓 없이도 동작가능 
HTTP long-polling fallback, Automatic reconnection, Packet buffering, Acknowledgements, Broadcasting, Multiplexing

설치
```
yarn add socket.io
```

- http://localhost:3000/socket.io/socket.io.js
- emit 이라는 메소드를 통하여 커스텀 이벤트로 type 없이 전송 가능
- json parse 안해줘도 socketIO가 전송시 오브젝트를 문자열로 변경하고 받으면 문자열을 오브젝트로 변경

- 서버사이드에서 clientCallback 함수 실행 사용 가능
- dataMessage 객체여부, 문자, 숫자등 타입 관계없이 몇개 넘기든 전송 가능
- rooms 기능이 socketIO 기본적으로 제공

home.pug
```
div#welcome 
                form 
                    input(placeholder="romm name" type="text", requerid)
                    button Enter Room

script(src="/socket.io/socket.io.js")
```

app.js
```
//socket 생성 메소드 이것은 프레임워크임
const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  console.log(input.value);
  socket.emit('room_enter', { payload: input.value });
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);
```

server.js
```
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
  //모든 소켓에 대한 정보까지 다 있는 socket 파라미터로 넘어옴
  //console.log(socket);
  socket.on('room_enter', (msg) => {
    console.log(msg);

  });
});
```

### SocketIO Adapter
 - adpter 를 통하여 room 접근
 - private 과 public room 별도 
```
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
```
### SocketIO AdminUI
- 설치 (powershell 로 설치 시 오류나면 node or cmd 로 설치)
```
npm i @socket.io/admin-ui
```
- 사용자 넣기 가능
```
const socketIOServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(socketIOServer, {
  auth: false,
});
```

- https://admin.socket.io/ 접속하여 url 입력 http://localhost:3000/admin
- 쌈박하게 나오네.. 가볍게 운영하기 좋아보임 :D

## MediaStream
- 시스템설정에 앱에서 미디어 장비 엑세스 허용 후 진행가능
- navigator.mediaDevices 객체를 통하여 디바이스 접근
- stream 객체를 통해 tracks 을 받아서 접근
- 스트림을 다시 받아와서 처리 연결하여 카메라 변경
- 스트림 이네이블 바꿔서 온오프 처리

home.pug
```
video#myFace(autoplay, playsinline, width="400", height="400") 
            button#btnMute 사운드ON
            button#btnCamera 카메라ON
            select#selectCamera
```
app.js
```
const myFace = document.getElementById('myFace');
const btnMute = document.getElementById('btnMute');
const btnCamera = document.getElementById('btnCamera');
const cameraSelect = document.getElementById('selectCamera');
let cameraOff = true;
let muted = true;

let myStream;

async function getMedia(deviceId) {
  console.log('a');
  const initialConstrains = {
    audio: true,
    video: { facingMode: 'user' },
  };
  const cameraConstraints = {
    audio: true,
    video: {
      deviceId: {
        exact: deviceId,
      },
    },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains,
    );

    // myStream.getTracks().forEach((track) => {
    //   track.enabled = false;
    // });

    //console.log(myStream.getTracks());
    /* 스트림 사용 */
    myFace.srcObject = myStream;

    if (!deviceId) {
      getCamera();
    }
  } catch (err) {
    console.log(err);
    console.error(err.message);
    /* 오류 처리 */
  }
}
getMedia();

async function getCamera() {
  try {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const cameras = mediaDevices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.text = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (err) {
    console.log(err);
    console.error(err.message);
  }
}

function handleBtnMuteClick(event) {
  try {
    myStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  } catch (err) {
    console.error(err.message);
  }

  if (!muted) {
    btnMute.innerHTML = '사운드ON';
  } else {
    btnMute.innerText = '사운드OFF';
  }
  muted = !muted;
}

function handleBtnCameraClick(event) {
  try {
    myStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  } catch (err) {
    console.error(err.message);
  }

  if (!cameraOff) {
    btnCamera.innerText = '카메라ON';
  } else {
    btnCamera.innerText = '카메라OFF';
  }
  cameraOff = !cameraOff;
}

function handleCameraCSelectInput() {
  getMedia(cameraSelect.value);
}

btnMute.addEventListener('click', handleBtnMuteClick);
btnCamera.addEventListener('click', handleBtnCameraClick);
cameraSelect.addEventListener('input', handleCameraCSelectInput);
```

## WebRTC(Web Real-Time Communication)
- 웹 애플리케이션과 사이트가 중간자 없이 브라우저 간에 오디오나 영상 미디어를 포착하고 마음대로 스트림 할 뿐 아니라, 임의의 데이터도 교환할 수 있도록 하는 기술(peer to peer)
- 서버는 브라우저 settings, configration, 위치 전달
- peer 가 많아지면 느려진다는 단점이 있지.. 큰곳은 SFU

### socketIO 를 통하여 RTC 연결해보자
1. getUserMedia
2. addStream(addTrack)
3. createPeerWebRTC
4. createOffer
5. setLocalDescription
6. send off to server by socketIO
7. send off to client(room member)
8. setRemoteDescription
9. createAnswer
10. setLocalDescription(answer)
11. ...

#### RTCIceCandidate
- RTCIceCandidate 인터페이스는 WebRTC API의 한 종류로서, RTCPeerConnection을 구축 할 때 사용되기도하는 Internet Connectivity Establishment (ICE (en-US))의 후보군 (candidate)를 말합니다.

하나의 ICE candidate는 WebRTC가 원격 장치와 통신을 하기 위해 요구되는 프로토콜과 라우팅에 대해 알려줍니다. WebRTC 피어 연결을 처음 시작하게되면, 일반적으로 여러개의 candiate들이 연결의 각 end에 의해 만들어집니다. 그리고 이 과정은 로컬 유저와 원격 유저가 연결을 위해 최고의 방법을 서로의 동의하에 선택하기 전까지 계속 됩니다. 이후에 WebRTC가 선택한 candidate를 사용해서 연결을 시도시도하게됩니다.

### local tunnel 
- Localtunnel allows you to easily share a web service on your local development machine without messing with DNS and firewall settings
```
npm install -g localtunnel
lt --port 3000
your url is: https://xxxxxxxxxx
```

### STUN Server
- 별도 공부
- google 서버로 대체
- 서비스 하려면 별도로 만들어야함


#### 참고
- SocketIO 소켓통신프레임워크 https://socket.io/
- SocketIO npm https://www.npmjs.com/package/socket.io
- 웹소켓 참고 https://developer.mozilla.org/ko/docs/Web/API/WebSocket/WebSocket
- ws package https://www.npmjs.com/package/ws
- mvp css https://andybrewer.github.io/mvp/
- 노마드 코더 줌 클론코딩 https://nomadcoders.co/noom/lobby
- mediaStream https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/
- webRTC https://developer.mozilla.org/ko/docs/Web/API/RTCPeerConnection
- RTCIceCandidate https://developer.mozilla.org/ko/docs/Web/API/RTCIceCandidate
- localtunnel http://localtunnel.github.io/www/
- stun https://alnova2.tistory.com/1110