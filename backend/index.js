const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/task-routes");
const userRoutes = require("./routes/user-routes");
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/task", taskRoutes);
app.use("/auth", userRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Błąd serwera" });
});

mongoose
  .connect("mongodb://localhost:27017")
  .then(app.listen(3000, () => console.log("dziala")))
  .catch((err) => console.log(err));
