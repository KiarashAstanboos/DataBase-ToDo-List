const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const TaskModel = require("./models/tasks");
const UserModel = require("./models/User");

const url = "mongodb://localhost:27017/ToDo";
const port = 3001;
const secret = "your_jwt_secret"; // Replace with your own secret

app.use(cors());
app.use(express.json());

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, secret, {
    expiresIn: "1h",
  });
};

// Authentication middleware
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    token = token.split(" ")[1]; // Remove Bearer from token
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new UserModel({ username, password });
    await user.save();
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json(err);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json(err);
  }
});

// Secure routes
app.get("/getTasks", protect, async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).json(err);
  }
});

app.post("/createTask", protect, async (req, res) => {
  try {
    const newTask = new TaskModel({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      user: req.user.id,
      category: req.body.category,  
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json(err);
  }
});

app.get("/completionPercentage", protect, async (req, res) => {
  try {
    const totalTasks = await TaskModel.countDocuments({ user: req.user.id });
    const completedTasks = await TaskModel.countDocuments({
      user: req.user.id,
      status: true,
    });

    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    res.json({ completionPercentage: percentage });
  } catch (err) {
    console.error("Error calculating completion percentage:", err);
    res.status(500).json(err);
  }
});

app.put("/editTask/:id", protect, async (req, res) => {
  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
        category: req.body.category,
      },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json(err);
  }
});

app.delete("/deleteTask/:id", protect, async (req, res) => {
  try {
    await TaskModel.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json(err);
  }
});
app.get("/getTasks/:category", protect, async (req, res) => {
  try {
    const { category } = req.params;
    const query = category === "All" ? { user: req.user.id } : { user: req.user.id, category };

    const tasks = await TaskModel.find(query);
    res.json(tasks);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log("Server is running at port " + port);
});
