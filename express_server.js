const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function() {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const templateVars = { shortURL, longURL: urlDatabase[shortURL]};
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});