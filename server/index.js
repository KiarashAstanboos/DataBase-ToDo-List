const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const url = "mongodb://localhost:27017/ToDo";
const port = 3000;
const app = express();
const TaskModel = require("./models/tasks");

app.use(cors());
app.use(express.json());

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch(err => console.log("Database connection error:", err));

app.get("/getTasks", async (req, res) => {
  try {
    console.log("Received request to /getTasks");
    const tasks = await TaskModel.find({});
    console.log("Tasks retrieved successfully:", tasks);
    res.json(tasks);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).json(err);
  }
});

app.post("/createTask", async (req, res) => {
  try {
    const newTask = new TaskModel({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json(err);
  }
});

app.listen(port, () => { 
  console.log("Server is running at port " + port);
});
