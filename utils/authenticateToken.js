const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const cookieToken = req.cookies.token;
  let token;

  // Check if the token is in the Authorization header
  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else if (cookieToken) {
    // If the token is not in the Authorization header, try to get it from the cookie
    token = cookieToken;
  } else {
    // If there's no token in the Authorization header or cookie, the request is unauthorized
    return res.render("login", {
      alert: "You are not logged in! Please Login!",
    });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    req.user = user;
    next();
  });
};

exports.checkAuth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const cookieToken = req.cookies.token;
  let token;

  // Check if the token is in the Authorization header
  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else if (cookieToken) {
    // If the token is not in the Authorization header, try to get it from the cookie
    token = cookieToken;
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      next();
    }
    req.user = user;
    next();
  });
};
