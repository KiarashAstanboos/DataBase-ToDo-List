const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
});

const TaskModel = mongoose.model("Task", TaskSchema, "Tasks");
module.exports = TaskModel;
