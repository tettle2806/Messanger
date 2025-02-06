const userListElement = document.getElementById('user-list');
const chatHeaderElement = document.getElementById('chat-header');
const chatMessagesElement = document.getElementById('chat-messages');
const messageInputElement = document.getElementById('message-input');
const sendButtonElement = document.getElementById('send-button');
const logoutButtonElement = document.getElementById('logout-button');

// имитация пользователей и сообщений
const users = [
  { id: 1, name: 'Иван' },
  { id: 2, name: 'Мария' },
  { id: 3, name: 'Петр' }
];

const messages = {
  1: [
    { sender: 1, text: 'Привет!', timestamp: Date.now() },
    { sender: 2, text: 'Привет! Как дела?', timestamp: Date.now() + 1000 }
  ],
  2: [
    { sender: 1, text: 'Как успехи?', timestamp: Date.now() },
    { sender: 3, text: 'Все отлично!', timestamp: Date.now() + 1000 }
  ],
  3: []
};

let currentСобеседник = null;

function displayUsers() {
  userListElement.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user.name;
    li.addEventListener('click', () => selectUser(user));
    userListElement.appendChild(li);
  });
}

function selectUser(user) {
  currentСобеседник = user;
  chatHeaderElement.textContent = `Чат с ${user.name}`;
  displayMessages(user.id);
}

function displayMessages(userId) {
  chatMessagesElement.innerHTML = '';
  if (messages[userId]) {
    messages[userId].forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(message.sender === 1 ? 'sent' : 'received');
      messageElement.textContent = message.text;
      chatMessagesElement.appendChild(messageElement);
    });
    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
  }
}

function sendMessage() {
  const text = messageInputElement.value.trim();
  if (text && currentСобеседник) {
    const message = {
      sender: 1,
      text: text,
      timestamp: Date.now()
    };
    if (!messages[currentСобеседник.id]) {
      messages[currentСобеседник.id] = [];
    }
    messages[currentСобеседник.id].push(message);
    displayMessages(currentСобеседник.id);
    messageInputElement.value = '';
  }
}

sendButtonElement.addEventListener('click', sendMessage);
messageInputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function displayInitialMessage() {
    chatMessagesElement.innerHTML = '<div class="initial-message">Выберите чат для общения</div>';
}

async function logout() {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      window.location.href = '/auth';
    } else {
      console.error('Logout failed:', response.status);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

logoutButtonElement.addEventListener('click', logout);

displayUsers();
displayInitialMessage();