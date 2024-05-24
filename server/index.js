const express = require("express");
const app = express();
const mongoose = require("mongoose");
const TaskModel = require("./models/tasks");

const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.ks4ntai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  
);
// Test connection
mongoose.connection.once('open', function () {
  console.log('MongoDB database connection established successfully')
})
app.get("/getTasks", (req, res) => {
  TaskModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});


app.listen(3001, () => {
  console.log("SERVER RUNS PERFECTLY!");
});