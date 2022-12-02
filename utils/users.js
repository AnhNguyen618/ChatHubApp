// ARR of USERS
const users = [];

/* USER JOIN THE CHAT ROOM */
function userJoin(id, username, room) {
  if (!username || !room) {
    return {
      error: new Error("Please enter a player name and room!"),
    };
  }

  const user = { id, username, room };
  users.push(user);

 
  const existingUser = users.find((username) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: new Error("User name is in use!"),
    };
  }

  return user;
}



/* GET CURRENT USER WHEN JOIN THE CHAT ROOM */
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

/* USER LEAVE THE CHAT ROOM */
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

/* GET ALL USER(S) IN THE CHAT ROOM */
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

// EXPORT
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};