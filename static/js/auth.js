document.addEventListener('DOMContentLoaded', () => {
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const loginButton = document.getElementById('login-button');
  const registerEmailInput = document.getElementById('register-email');
  const registerNameInput = document.getElementById('register-name');
  const registerPasswordInput = document.getElementById('register-password');
  const registerConfirmPasswordInput = document.getElementById('register-confirm-password');
  const registerButton = document.getElementById('register-button');
  const messagesDiv = document.getElementById('messages');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const chatContainer = document.getElementById('chat-container');

  let username = null; // Store the username after login/registration

  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate all tabs and content
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Activate the clicked tab and content
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  registerButton.addEventListener('click', async () => {
    const email = registerEmailInput.value;
    const name = registerNameInput.value;
    const password = registerPasswordInput.value;
    const confirmPassword = registerConfirmPasswordInput.value;

    // Basic client-side validation
    if (!email || !name || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      // Simulate successful registration
      // In a real application, you would send this data to a backend server
      // and handle errors properly.
      console.log('Registration successful:', { email, name, password });
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  });

  loginButton.addEventListener('click', async () => {
    const emailValue = loginEmailInput.value;
    const password = loginPasswordInput.value;

    // Basic client-side validation
    if (!emailValue || !password) {
      alert('Please enter an email and password.');
      return;
    }

    try {
      // Simulate successful login
      // In a real application, you would send this data to a backend server
      // and handle errors properly.
      console.log('Login successful:', { email: emailValue, password });
      username = emailValue; // Store the username (email in this case)
      document.getElementById('login').style.display = 'none';
      document.getElementById('register').style.display = 'none';
      document.querySelector('.tabs').style.display = 'none';
      chatContainer.style.display = 'flex';
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  });

  sendButton.addEventListener('click', () => {
    const messageText = messageInput.value;

    if (!messageText) {
      return;
    }

    // Simulate sending a message
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${username}: ${messageText}`;
    messagesDiv.appendChild(messageElement);

    // Clear the input field
    messageInput.value = '';

    // Scroll to the bottom of the messages
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
});