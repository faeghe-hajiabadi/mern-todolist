require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection error", err);
  });
// task schema

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);

// add new task
app.post("/tasks", async (req, res) => {
  try {
    const title = req.body.title;
    const newTask = new Task({ title });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error Adding task" });
  }
});
// get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error finding task" });
  }
});
app.put('/tasks/:id',async(req,res)=>{
    try {
        const {id} = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id,{completed:true},{new:true})
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({error:'Error updating task'})
    }
})
app.delete('/tasks/:id',async(req,res)=>{
    try {
      const {id} = req.params;
      await Task.findByIdAndDelete(id);
      res.status(200).json({message:'Task deleted'});  
    } catch (error) {
        res.status(500).json({error:'Error deleting task'})
    }
})

app.listen(PORT,()=>{
    console.log('server is running on port 5001');
})