const DUMMY_TASKS = ["wyjsc z psem", "posprzatac pokoj"];
const Task = require("../models/task-schema");
const mongoose = require("mongoose");

const getAllTasks = async (req, res) => {
  const allTasks = await Task.find();
  res.json({ allTasks });
};

const getTaskByCreator = async (req, res) => {
  const { creator } = req.params;
  const tasks = await Task.find({
    creator: { $regex: new RegExp(creator, "i") },
  });
  const tasksContent = tasks.map((task) => task.content);
  res.json(tasks);
};

const createTask = async (req, res) => {
  const { content, creator } = req.body;
  try {
    const newTask = new Task({
      content,
      creator,
    });

    const savedTask = await newTask.save();
    res.json({ message: "Utworzono" });
  } catch (err) {
    console.error(err.message);
  }
};

const removeTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (!deletedTask) {
      return res.status(404).json({ message: new mongoose.Types.ObjectId(id) });
    }
    await deletedTask.deleteOne();

    res.json({ message: "Usunięto" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ id, message: "Blad serwera" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { newValue } = req.body;
  try {
    if (!newValue) {
      return res
        .status(400)
        .json({ message: "Nie podano nowej wartości zadania" });
    }

    const task = await Task.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!task) {
      return res.status(404).json({ message: "Nie znaleziono zadania" });
    }

    task.content = newValue;
    await task.save();
    res.json({ message: "Edytowano" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ id, message: "Błąd serwera" });
  }
};

module.exports = {
  getAllTasks,
  getTaskByCreator,
  createTask,
  removeTask,
  updateTask,
};
