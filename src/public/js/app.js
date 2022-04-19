const messageList = document.querySelector('#chat');

//socket 생성 메소드 이것은 프레임워크
const socket = io();

const welcome = document.getElementById('welcome');
const welcomeForm = welcome.querySelector('#roomForm');
const room = document.getElementById('room');
const messageForm = room.querySelector('#messageForm');
const nickForm = welcome.querySelector('#nickForm');

room.hidden = true;

let roomName;

function addMessage(message) {
  const li = document.createElement('li');
  li.innerHTML = message;
  messageList.appendChild(li);
}

function showRoom() {
  room.hidden = false;
  welcome.hidden = true;
  const h3 = room.querySelector('h3');
  h3.innerHTML = roomName;
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector('input');
  socket.emit('room_enter', { roomName: input.value }, showRoom);
  roomName = input.value;
  input.value = '';
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  const inputValue = input.value;
  socket.emit('new_message', { roomName: roomName, message: inputValue }, () => {
    addMessage(`You : ${inputValue}`);
  });
  input.value = '';
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector('input');
  const inputValue = input.value;
  socket.emit('nickName', { nickName: inputValue }, () => {});
  input.value = '';
}

welcomeForm.addEventListener('submit', handleRoomSubmit);
messageForm.addEventListener('submit', handleMessageSubmit);
nickForm.addEventListener('submit', handleNickSubmit);

socket.on('new_message', (message) => {
  addMessage(message);
});

socket.on('welcome', (user) => {
  addMessage(`${user} Joined!`);
});

socket.on('bye', (user) => {
  addMessage(`${user} Left!`);
});

socket.on('room_change', (rooms) => {
  //console.log(rooms);
  const roomList = document.getElementById('roomList');
  roomList.innerHTML = '';
  rooms.forEach((value, index) => {
    const li = document.createElement('li');
    li.innerHTML = value;
    roomList.appendChild(li);
  });
});

/*
웹소켓을 활용한 간단한 채팅 구현

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

  const el = document.createElement('li');
  el.innerHTML = `You : ${input.value}`;

  messageList.appendChild(el);

  input.value = '';
});

nickForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nick', input.value));
  input.value = '';
});
*/

const myFace = document.getElementById('myFace');
const btnMute = document.getElementById('btnMute');
const btnCamera = document.getElementById('btnCamera');
const cameraSelect = document.getElementById('selectCamera');
let cameraOff = true;
let muted = true;

let myStream;

async function getMedia(deviceId) {
  console.log('getMedia');
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
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    videoSender = myPeerConnection.getSenders().find((sender) => sender.track.kind === 'video');
    videoSender.replaceTrack(videoTrack);
  }
}

btnMute.addEventListener('click', handleBtnMuteClick);
btnCamera.addEventListener('click', handleBtnCameraClick);
cameraSelect.addEventListener('input', handleCameraCSelectInput);

//welcome

const callRoomForm = document.getElementById('callRoomForm');
const callVideo = document.getElementById('callVideo');
callVideo.hidden = true;
let callRoomName = '';

let myPeerConnection;

async function initMedia() {
  console.log('initMedia');
  callRoomForm.hidden = true;
  callVideo.hidden = false;
  await getMedia();
  mekeConnection();
}

function mekeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  });

  myPeerConnection.addEventListener('icecandidate', handleMyPeerConnectionIceCandidate);
  myPeerConnection.addEventListener('addstream', handleAddStrea);
  try {
    myStream.getTracks().forEach((track) => {
      myPeerConnection.addTrack(track, myStream);
    });
  } catch (e) {
    console.error(e);
  }
}

async function handleCallRoomFormSubmit(event) {
  event.preventDefault();

  const input = callRoomForm.querySelector('input');
  callRoomName = input.value;
  await initMedia();
  socket.emit('join_room', callRoomName);
  input.value = '';
}

socket.on('callWelcome', async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);

  socket.emit('offer', offer, callRoomName);
  //console.log(offer);
});

socket.on('offer', async (offer) => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit('answer', answer, callRoomName);
});

socket.on('answer', (answer) => {
  //console.log(answer)
  myPeerConnection.setRemoteDescription(answer);
});

function handleMyPeerConnectionIceCandidate(data) {
  //console.log(data);
  socket.emit('ice', data.candidate, callRoomName);
}

socket.on('ice', (ice) => {
  //console.log(ice);
  console.log('recive candidate');
  myPeerConnection.addIceCandidate(ice);
});

function handleAddStrea(data) {
  console.log('handleAddStrea');
  console.log(data.stream);

  document.getElementById('peerVideo').srcObject = data.stream;

  //const peerDiv = document.getElementById('peerVideo');
  // const video = document.createElement('video');
  // video.width = '300';
  // video.height = '300';
  // video.autoplay = true;
  // video.playsInline = true;
  // video.srcObject = data.stream;
  //peerDiv.appendChild(video);
}

callRoomForm.addEventListener('submit', handleCallRoomFormSubmit);
