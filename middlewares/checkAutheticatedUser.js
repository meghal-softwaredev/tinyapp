const checkAutheticatedUser = (req, res, next) => {
  let userID = req.session.userId;
  if (!userID) {
    return res.status(401).render('urls_error');
  }
  next();
};

module.exports = { checkAutheticatedUser };