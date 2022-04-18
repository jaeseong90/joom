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
  console.log(rooms);
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
