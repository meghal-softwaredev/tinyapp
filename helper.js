const uuid = require('uuid').v4;
const { users, urlDatabase} = require('./database');

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

const urlsForUser = function(uid) {
  let result = {};
  for (let url in urlDatabase) {
    if (uid === urlDatabase[url].userID) {
      result[url] = urlDatabase[url].longURL;
    }
  }
  return result;
};

module.exports = { generateRandomString, findUserByEmail, urlsForUser};