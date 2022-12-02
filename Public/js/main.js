
// Extract the room and username value from the URL 
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// The io function is provided by the client-side Socket.IO library that was loaded in public/chat.html.
const socket = io();

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

/*
  SOCKETIO JOIN EVENT EMITTER
Call socket.emit() to send an event to the server.
If there’s an error, the player will see an alert and be redirected back to the registration page, /.
*/
socket.emit('joinRoom', { username, room }, error => {
  if (error) {
    alert(error);
    location.href = '/';
}
});

/*
  SOCKETIO MESSAGE EVENT LISTENER
*/
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
 
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;      
});
/*
  SOCKETIO IMAGE MESSAGE EVENT LISTENER
*/
socket.on('imageMessage', image => {
  console.log("received an image", image);
  outputImage(image);
});

/*
  CHAT SECTION
*/
// Allow players to communicate with each other in the chatbox
const chatForm = document.getElementById('chat-form'); // Target the chat form in the DOM
// Add an event listener on the chat form.
chatForm.addEventListener('submit', (event) => {  
    event.preventDefault();
    // Extract the message that the user typed into the message box.
    const msg = event.target.elements.msg.value;

    // Send an event to the server along with the player’s chat message.
    socket.emit('chatMessage', msg);
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus()

    // Alert an error if an error is received from the server.
    if (error) return alert(error);
});

function onImageSelected(event) {
  console.log("=== img selected", event)
   const img = event.target.files[0];
   console.log("== DEBUG", img);

   let reader = new FileReader();    
   reader.onload = function() {
     socket.emit("chatImage", this.result.replace('/.*base64,/,', ''));
   }
   reader.readAsDataURL(img);
   
}

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text"> 
      ${message.text}
  </p>`;    

  document.querySelector('.chat-messages').appendChild(div);
}

function outputImage(image) {  
  const div = document.createElement('div');
  div.classList.add('message');
  // div.innerHTML = `<p class="meta"> ${image.username} <span> ${image.time} </span></p>
  // <img class="img" src="${image}"/>`;
  div.innerHTML = `<p class="meta"> Mars </p>
  <img class="img" src="${image}"/>`;
  document.querySelector('.chat-messages').appendChild(div);
  //console.log("creating img tag")
}

  // Add room name to DOM
  function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM 
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}