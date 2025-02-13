import { useEffect, useState } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [checked, setChecked] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5001/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.map((task) => task));
      });
  }, []);
  const sendTaskToServer = (task) => {
    fetch("http://localhost:5001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: task }),
    })
      .then((res) => res.json())
      .then((data) => {
        const addedTask = { title: task, id: data._id };
        setTasks([...tasks, addedTask]);
      });
  };
  const handleToggle = (value) => () => {
    console.log("clicked handleToggle", value);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    console.log("currentIndex", currentIndex, newChecked);
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    const updatedTask = tasks.find((task) => task.title === value);
    fetch(`http://localhost:5001/tasks/${updatedTask._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !updatedTask.completed }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data after update", data);
      });
  };
  const handleInputChange = (event) => {
    setTask(event.target.value);
  };
  const submitTask = () => {
    sendTaskToServer(task);
    setTask("");
  };
  const handleDeleteTask = (value) => {
    const deletedTask = tasks.find((task) => task.title === value);
    setTasks(tasks.filter((task) => task.title !== value));
    fetch(`http://localhost:5001/tasks/${deletedTask._id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data after delete", data);
      });
  };
  return (
    <>
      <h1>Todo List</h1>
      <TextField
        id="margin-dense"
        margin="dense"
        label="Task"
        variant="outlined"
        onChange={handleInputChange}
      />
      <br />
      <Button variant="contained" onClick={submitTask}>
        Submit
      </Button>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {tasks.map((task) => {
          const labelId = `checkbox-list-label-${task.title}`;
          const isChecked = checked.includes(task.title);
          return (
            <ListItem
              key={task.title}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => handleDeleteTask(task.title)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                role={undefined}
                onClick={handleToggle(task.title)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(task.title)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`${task.title}`}
                  sx={{
                    textDecoration:
                      isChecked || task.completed ? "line-through" : "none",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

export default App;
