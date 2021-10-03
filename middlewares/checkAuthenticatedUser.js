const { urlDatabase } = require('../database/database');

const checkAuthenticatedUser = (req, res, next) => {
  const userID = req.session.userId;
  if (!userID) {
    return res.status(401).render('urls_error');
  }
  next();
};

const checkOwnerURL = (req, res, next) => {
  const userID = req.session.userId;
  const shortURL = req.params.shortURL;
  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send('<p>URL does not exist<br><br><a href="/urls">URLs Page</a></p>');
  }
  if (userID !== urlDatabase[shortURL].userID) {
    return res.status(401).render('urls_error_owner');
  }
  next();
};

module.exports = { checkAuthenticatedUser, checkOwnerURL };