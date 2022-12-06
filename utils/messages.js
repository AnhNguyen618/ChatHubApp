/* 
 function to format messages 
 so that they include time stamps, which we’ll display along with the chat messages .
*/

// const moment = require('moment');
// moment =  moment.toLocaleString("en-US", {
//   timeZone: "America/Los_Angeles"
// });

function formatMessage(username, text) {
  return {
    username,
    text,
    //time: moment().format('h:mm a')
  };
}

function formatImage(username, image) {
  const result = {
    username: username,
    image: image,
   // time: moment().format('h:mm a')
  };
  return result;
}
// export
module.exports = formatMessage, formatImage;