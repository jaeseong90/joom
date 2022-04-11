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
