const DUMMY_TASKS = ["wyjsc z psem", "posprzatac pokoj"];
const Task = require("../models/task-schema");
const mongoose = require("mongoose");
const ErrorHandler = require("../models/error-handler");

const getAllTasks = async (req, res) => {
  const allTasks = await Task.find();
  res.json({ allTasks });
};

const getTaskByCreator = async (req, res, next) => {
  const { creator } = req.params;
  const tasks = await Task.find({
    creator: { $regex: new RegExp(creator, "i") },
  });
  const tasksContent = tasks.map((task) => task.content);
  res.json(tasks);
};

const createTask = async (req, res, next) => {
  const { content, creator } = req.body;
  try {
    const newTask = new Task({
      content,
      creator,
    });

    const savedTask = await newTask.save();
    res.json({ message: "Utworzono" });
  } catch (error) {
    next(error);
  }
};

const removeTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!deletedTask) {
      return next(new ErrorHandler("Nie znaleziono zadania do usuniecia", 404));
    }
    await deletedTask.deleteOne();

    res.json({ message: "Usunięto" });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { newValue } = req.body;
  try {
    if (!newValue) {
      return next(new ErrorHandler("Proszę wpisać wartość zadania", 404));
    }

    const task = await Task.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!task) {
      return next(
        new ErrorHandler("Nie znaleziono zadania do aktualizacji", 404)
      );
    }

    task.content = newValue;
    await task.save();
    res.json({ message: "Edytowano" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskByCreator,
  createTask,
  removeTask,
  updateTask,
};
