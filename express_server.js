const express = require("express");
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { checkAuthenticatedUser, checkOwnerURL } = require('./middlewares/checkAuthenticatedUser');
const { urlDatabase, users } = require("./database/database");
const { generateRandomString, urlsForUser, authenticateUser, validateRegistration } = require("./helperFunctions/helper");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001; // default port 8080

//Set view engine ejs
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['Knowledge is Power', 'Time is money']
}));
app.use(methodOverride('_method'));

//If home route => redirect to login
app.get("/", (req, res) => {
  res.redirect("/login");
});

//Render page for Registration
app.get("/register", (req, res) => {
  res.render("urls_register", { user: '' });
});

//Process Registration
app.post("/register", (req,res) => {
  //Extract email and password from body
  const {email, password} = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const result = validateRegistration(email, password);
  if (result.error) {
    return res.status(400).send(result.error);
  }
  //Insert new entry for user in db
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password: hashPassword
  };
  //set cookie and redirect
  req.session.userId = userId;
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
  const result = authenticateUser(email, password);
  if (result.error) {
    return res.status(403).send(result.error);
  }
  //set cookie and redirect
  req.session.userId = result.user;
  res.redirect("/urls");
});

//Logout => Clear cookie and redirect to Login
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//show URLs if Logged in
app.get("/urls", checkAuthenticatedUser, (req, res) => {
  const userID = req.session.userId;
  const urls = urlsForUser(userID);
  const templateVars = {
    user: users[userID],
    urls
  };
  res.render("urls_index", templateVars);
});

//Route to create new URL if user is Logged in
app.get("/urls/new", checkAuthenticatedUser, (req, res) => {
  res.render("urls_new", { user: users[req.session.userId] });
});

//After submitting new URL, if user is logged in => Entry made in urlDatabase db
//user will be redirect
app.post("/urls", checkAuthenticatedUser, (req, res) => {
  if (req.body.longURL === '') {
    return res.status(400).send('Enter new URL');
  }
  const shortURL =  generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userId
  };
  res.redirect(`/urls/${shortURL}`);
});

//Redirect short URL to long URL => whether logged in or not
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send('<p>URL does not exist<br><br><a href="/urls">URLs Page</a></p>');
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//URLs Edit => render template to show Short and Long URL
app.get("/urls/:shortURL", checkAuthenticatedUser, checkOwnerURL, (req, res) => {
  const userID = req.session.userId;
  const shortURL = req.params.shortURL;
  const urls = urlsForUser(userID);
  const templateVars = {
    user: users[userID],
    shortURL,
    longURL: urls[shortURL]
  };
  res.render("urls_show", templateVars);
});

//URLs Edit => update Long URL if user is logged in
app.put("/urls/:shortURL", checkAuthenticatedUser, checkOwnerURL, (req,res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.newURLVal;
  res.redirect("/urls");
});

//URLs Delete => Delete URL and redirect
app.delete("/urls/:shortURL/delete", checkAuthenticatedUser, checkOwnerURL, (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Server Listening to PORT 5001
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
