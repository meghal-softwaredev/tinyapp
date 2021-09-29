const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { urlDatabase, users } = require("./database");
const { generateRandomString, findUserByEmail } = require("./helper");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { email: users[req.cookies['user_id']].email, urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { email: users[req.cookies['user_id']].email });
});

app.post("/urls", (req, res) => {
  const shortURL =  generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/u/${shortURL}`);       
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    res.status(404).send('Not found');
  } else {
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  const templateVars = { email: users[req.cookies['user_id']].email, shortURL, longURL: urlDatabase[shortURL]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req,res) => {
  let shortUrl = req.params.id;
  urlDatabase[shortUrl] = req.body.newURLVal;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req,res) => {
  let shortUrl = req.params.shortURL;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("urls_register", {email:''});
});

app.post("/register", (req,res) => {
  const {email, password} = req.body;
  if (email === '' || password === '') {
    return res.status(400).send("Enter valid Email/Password");
  } 
  if (findUserByEmail(email)) {
     return res.status(400).send("Email already exists.");
  }
  let userId = generateRandomString();
  users[userId] = { id: userId, email, password};
  res.cookie('user_id', userId);
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  res.render("urls_login", {email:''});
});

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  let userId = findUserByEmail(email);
  if (!userId) return res.status(403).send("Wrong Credentials");
  if (password !== users[userId].password) {
    return res.status(403).send("Wrong Credentials");
  }
  res.cookie('user_id', userId);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { users };