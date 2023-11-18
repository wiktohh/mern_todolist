const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-schema");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Nie znaleziono użytkownika" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Złe hasło" });
    }
    const token = jwt.sign(
      { username: user.username, name: user.name },
      "secret-key"
    );
    res.json({ name: user.name, username: user.username, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Blad serwera" });
  }
};

const createUser = async (req, res) => {
  const { name, username, password, secondPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!password || !name || !username || !secondPassword) {
      return res.status(400).json({ message: "Uzupelnij wszystkie dane" });
    }
    if (user) {
      return res.status(400).json({ message: "Username zajęty" });
    }
    if (password !== secondPassword) {
      return res.status(400).json({ message: "Hasła są różne" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign(
      { username: newUser.username, name: newUser.name },
      "secret-key"
    );
    res.json({ name: newUser.name, username: newUser.username, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Blad serwera" });
  }
};

module.exports = { loginUser, createUser };
