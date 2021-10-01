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
// console.log(bcrypt.hashSync("purple-monkey-dinosaur", 10));
// console.log(bcrypt.hashSync("dishwasher-funk", 10));
//Users data
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "a@a.com",
    password: "$2a$10$wVWX89GrwQ62Zy.w17cY7uuuxtMXBJ97O3hYeYcph5f8u6GkiHVt2"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "b@b.com",
    password: "$2a$10$voCEG2ip4cV6devarGRPf.4s3a32YTVwqkSpLICk04zm.bmu0qXjK"
  }
};

module.exports = { urlDatabase, users };
