const express = require("express");
const userController = require("../controllers/user-controller");
const jwtMiddleware = require("../middlewares/check-auth");

const router = express.Router();

router.post("/login", userController.loginUser);
router.post("/register", userController.createUser);
router.get("/getUser", jwtMiddleware, userController.getUser);

module.exports = router;
