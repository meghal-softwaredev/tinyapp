const uuid = require('uuid').v4;
const { users } = require('./database');

const generateRandomString = function() {
  return uuid().substr(0,6);
};

const findUserByEmail = function(email) {
  for (let user in users) {
    if (email === users[user].email) return user;
  }
  return false;
};

module.exports = { generateRandomString, findUserByEmail };