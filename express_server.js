const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { urlDatabase, users } = require("./database");
const { generateRandomString, findUserByEmail, urlsForUser } = require("./helper");
const app = express();
const PORT = 8080; // default port 8080

//Set view engine ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//If home route => redirect to login
app.get("/", (req, res) => {
  res.redirect("/login");
});

//show URLs if Logged in
app.get("/urls", (req, res) => {
  let userID = req.cookies['user_id'];
  if (!userID) return res.status(401).render('urls_error');
  let urls = urlsForUser(userID);
  const templateVars = { user: users[req.cookies['user_id']], 
  urls: urls };
  res.render("urls_index", templateVars);
});

//Route to create new URL if Logged in
app.get("/urls/new", (req, res) => {
  if (!req.cookies['user_id']) return res.status(401).render('urls_error');
  res.render("urls_new", { user: users[req.cookies['user_id']] });
});

//After submitting new URL, if user is logged in => Entry made in urlDatabase db
//user will be redirect
app.post("/urls", (req, res) => {
  let userID = req.cookies['user_id'];
  if (!userID) return res.status(401).render('urls_error');
  const shortURL =  generateRandomString();
  urlDatabase[shortURL] = {longURL: '', userID: ''};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = userID;
  res.redirect(`/u/${shortURL}`);       
});

//Redirect short URL to long URL => whether logged in or not
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send('Not found');
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//URLs Edit => render template to show Short and Long URL
app.get("/urls/:shortURL", (req, res) => {
  let userID = req.cookies['user_id'];
  if (!userID) return res.status(401).render('urls_error');
  let urls = urlsForUser(userID);
  let shortURL = req.params.shortURL;
  const templateVars = { user: users[userID], shortURL, longURL: urls[shortURL]};
  res.render("urls_show", templateVars);
});

//URLs Edit => update Long URL if user is logged in
app.post("/urls/:id", (req,res) => {
  if (!req.cookies['user_id']) return res.status(401).render('urls_error');
  urlDatabase[req.params.id].longURL = req.body.newURLVal;
  res.redirect("/urls");
});

//URLs Delete => Delete URL and redirect
app.post("/urls/:shortURL/delete", (req,res) => {
  if (!req.cookies['user_id']) return res.status(401).render('urls_error');
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Render page for Registration
app.get("/register", (req, res) => {
  res.render("urls_register", {user:''});
});

//Process Registration
app.post("/register", (req,res) => {
  //Extract email and password from body
  const {email, password} = req.body;
  //If email or password is null => Error
  if (email === '' || password === '') {
    return res.status(400).send("Enter valid Email/Password");
  }
  //check for Email if already exists
  if (findUserByEmail(email)) {
     return res.status(400).send("Email already exists.");
  }
  //Insert new entry for user in db
  let userId = generateRandomString();
  users[userId] = { id: userId, email, password};
  //set cookie and redirect
  res.cookie('user_id', userId);
  res.redirect("/urls");
});

//Render page for Login
app.get("/login", (req, res) => {
  res.render("urls_login", {user:''});
});

//Process Login
app.post("/login", (req, res) => {
  //extract email and password from body
  const {email, password} = req.body;
  let userId = findUserByEmail(email);
  //If no user found with email => Error
  if (!userId) return res.status(403).send("Wrong Credentials");
  //If password mismatch => Error
  if (password !== users[userId].password) {
    return res.status(403).send("Wrong Credentials");
  }
  //set cookie and redirect
  res.cookie('user_id', userId);
  res.redirect("/urls");
});

//Logout => Clear cookie and redirect to Login
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
});

//Server Listening to PORT 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { users };