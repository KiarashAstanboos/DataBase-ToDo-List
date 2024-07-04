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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["Business", "Daily"],
    default: 'Daily' ,
    required: true,
  },
});

const TaskModel = mongoose.model("Task", TaskSchema, "Tasks");
module.exports = TaskModel;
