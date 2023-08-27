function createUserSession(req, user, action) { 
  req.session.uid = user._id.toString();
}

module.exports = {
  createUserSession: createUserSession,
}