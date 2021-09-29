const uuid = require('uuid').v4;
const { users } = require('./database');

//Generates random string of length 6 for unique id
const generateRandomString = function() {
  return uuid().substr(0,6);
};

//Finds user by email
const findUserByEmail = function(email) {
  for (let user in users) {
    if (email === users[user].email) return user;
  }
  return false;
};

module.exports = { generateRandomString, findUserByEmail};