
const express = require('express'); // We use the CommonJS require() function to import the Express module into the program.
const path = require('path'); //  We import Node.js’s path module. It's needed to generate the absolute path to the Public/ folder.

 // Connect Socket.IO to our Express server.
const http = require("http");
const socketio = require("socket.io");

// Importing helper functions
const formatMessage = require("./utils/messages");
const formatImage = require("./utils/messages");
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
  } = require("./utils/users");


const app = express(); // We invoke express() to instantiate a new Express application.

// create the HTTP server using the Express app created on the previous line
const server = http.createServer(app); // http.createServer() creates a new HTTP server and returns it.
const io = socketio(server); // connect Socket.IO to the HTTP server
  
/*
-- Serving static assets --
We construct the absolute path to the public/ folder.
path.join allows us to create an absolute path by combining:
__dirname: the directory path for the current script
./public: the relative path to the public/folder.
*/
const publicDirectoryPath = path.join(__dirname, "./public");

/*
-- Serve static files to the client --
We register a middleware function using app.use(). We call express.static() within the app.use()
It is a built-in middleware function that serves static assets included in the public/ directory to the client.
*/
app.use(express.static(publicDirectoryPath));

// Create Bot for chatHub
const botName = "ChatHub Bot";

// listen for new connections to Socket.IO
io.on("connection", (socket) => {  
    socket.on("joinRoom", ({ username, room }) => {      
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
        
    // Welcome current user
     socket.emit("message", formatMessage(botName, "Welcome to ChatHub!"));
    // socket.emit("message", "Welcome to ChatHub!");
    // Broadcasting a message when a user joins
    // We use socket.broadcast.to to send a message event 
    // to let all other users in the room know when a new user has joined the chat.
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
        // username + 'has joined the chat'
      );

    // Emit a "room" event to all users to update their Room Info sections
    // Displays the user’s current room and the users who are active in that room.
    io.in(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
    });

    }); 

    // Listening for the chatMessage event and emitting a message to all players
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Listening for the chatImage event and emitting a message to all players
    socket.on("chatImage", image => {
      const user = getCurrentUser(socket.id);
      console.log("=== received chatImage", image)
      io.to(user.room).emit("imageMessage", image);
     // io.to(user.room).emit("imageMessage", formatImage(user.username,image));
    })

    /* 
    -- Listening for the disconnect event and removing the player, then update room info ---
    Listen for the disconnect event on the server. 
    This event is automatically fired whenever a socket is disconnected.
    */
    socket.on("disconnect", () => {
    const disconnectedUser = userLeave(socket.id);
    // send a message to all other users in the room to let them know of the user’s departure
    if (disconnectedUser) {
      io.in(disconnectedUser.room).emit(
        "message",
        formatMessage(botName, `${disconnectedUser.username} has left the chat`)
      );
      // update the users list in the User Info section.
      io.in(disconnectedUser.room).emit("roomUsers", {
        room: disconnectedUser.room,
        users: getRoomUsers(disconnectedUser.room),
      });
    }
    });    
    
});

// We listen on port 8080 for incoming requests
const port = 8080 || process.env.port;
// and log a message when the server is up and running.
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
});