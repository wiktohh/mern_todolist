const express = require("express");
const taskController = require("../controllers/task-controller");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.get("/tasks", taskController.getAllTasks);
router.get("/task/:creator", taskController.getTaskByCreator);
router.post("/task", taskController.createTask);
router.delete("/task/:id", taskController.removeTask);
router.patch("/task/:id", taskController.updateTask);

router.use("/task", checkAuth);

module.exports = router;
