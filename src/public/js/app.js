const messageList = document.querySelector('ul');

//socket 생성 메소드 이것은 프레임워크임
const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector('input');
  console.log(input.value);
  socket.emit('room_enter', { payload: input.value }, () => {
    console.log('server is done!');
  });
  input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

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
