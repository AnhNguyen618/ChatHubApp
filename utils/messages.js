/* 
 function to format messages 
 so that they include time stamps, which we’ll display along with the chat messages .
*/

const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

function formatImage(username, image) {
  return {
    username,
    image:image.replace('/.*base64'),
    time: moment().format('h:mm a')
  };
}
// export
module.exports = formatMessage, formatImage;