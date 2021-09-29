const uuid = require('uuid').v4;
const { users } = require('./database');

const generateRandomString = function() {
  return uuid().substr(0,6);
};

const checkEmail = function(email) {
  for (let user in users) {
    if (email === users[user].email) return true;
  }
  return false;
};

module.exports = { generateRandomString, checkEmail };