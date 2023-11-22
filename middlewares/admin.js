const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

function checkAdminStatus(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access Forbidden !");
  else next();
}

module.exports = checkAdminStatus;
