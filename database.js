//URL data along with user information
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID"
  },
  i3BoKr: {
    longURL: "https://www.facebook.ca",
    userID: "user2RandomID"
  },
  i3RoGr: {
    longURL: "https://www.twitter.ca",
    userID: "user2RandomID"
  }
};

//Users data
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

module.exports = { urlDatabase, users };
