const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-schema");
const ErrorHandler = require("../models/error-handler");

require("dotenv").config();

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(new ErrorHandler("Nie znaleziono użytkownika", 404));
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(new ErrorHandler("Niepoprawne hasło", 401));
    }
    const token = jwt.sign(
      { username: user.username, name: user.name },
      process.env.SECRET_KEY
    );
    res.json(token);
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  const { name, username, password, secondPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!password || !name || !username || !secondPassword) {
      return next(new ErrorHandler("Proszę uzupełnić wszystkie pola"), 400);
    }
    if (user) {
      return next(new ErrorHandler("Podany username jest zajęty"));
    }
    if (password !== secondPassword) {
      return next(new ErrorHandler("Podane hasła się roznia"));
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign(
      { username: newUser.username, name: newUser.name },
      process.env.SECRET_KEY
    );
    res.json(token);
  } catch (error) {
    return error;
  }
};

const getUser = async (req, res, next) => {
  const user = req.userData;
  res.json(user);
};

module.exports = { loginUser, createUser, getUser };
