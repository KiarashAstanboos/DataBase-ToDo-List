const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  priority: {
    type: Number,
    required: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    required: false,
  },
});

const TaskModel = mongoose.model("Task", TaskSchema, "Tasks");
module.exports = TaskModel;
