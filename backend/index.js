const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

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
  .connect(process.env.MONGODB_URL)
  .then(app.listen(process.env.PORT, () => console.log("it works")))
  .catch((err) => console.log(err));
