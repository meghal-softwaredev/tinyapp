const uuid = require('uuid').v4;
const bcrypt = require('bcryptjs');
const { users, urlDatabase} = require('../database/database');

//Generates random string of length 6 for unique id
const generateRandomString = () => {
  return uuid().substr(0,6);
};

//Finds user by email
const findUserByEmail = email => {
  for (let user in users) {
    if (email === users[user].email) return user;
  }
  return;
};

//return urls for User
const urlsForUser = uid => {
  let result = {};
  for (let url in urlDatabase) {
    if (uid === urlDatabase[url].userID) {
      result[url] = urlDatabase[url].longURL;
    }
  }
  return result;
};

const authenticateUser = (email, password) => {
  const userId = findUserByEmail(email);
  //If no user found with email => Error
  if (!userId) {
    return { user: null, error: 'Wrong Credentials' };
  }
  //If password mismatch => Error
  if (!bcrypt.compareSync(password, users[userId].password)) {
    return { user: null, error: 'Wrong Credentials' };
  }
  return { user: userId, error: null };
};

const validateRegistration = (email, password) => {
  //If email or password is null => Error
  if (!email || !password) {
    return { error: 'Enter valid Email/Password' };
  }
  //check for Email if already exists
  if (findUserByEmail(email)) {
    return { error: 'Email already exists.' };
  }
  return { error: null };
};
module.exports = { generateRandomString, findUserByEmail, urlsForUser,authenticateUser, validateRegistration };