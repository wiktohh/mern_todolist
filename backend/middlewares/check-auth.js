const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Brak auth");
    }
    const decodedToken = jwt.verify(token, "secret-key");
    req.userData = { username: decodedToken.username, name: decodedToken.name };
    next();
  } catch (err) {
    const error = new Error("blad serwera");
    res.status(401).json({ message: "Authentication failed" });
  }
};
