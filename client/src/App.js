import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [listOfTasks, setListOfTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    Axios.get("http://localhost:3000/getTasks").then((response) => {
      setListOfTasks(response.data);
    });
  }, []);

  const createTask = () => {
    Axios.post("http://localhost:3000/createTask", {
      title,
      description,
      priority,
      status,
    }).then((response) => {
      setListOfTasks([
        ...listOfTasks,
        {
          title,
          description,
          priority,
          status,
        },
      ]);
    });
  };

  return (
    <div className="App">
      <div className="tasksDisplay">
        {listOfTasks.map((task) => {
          return (
            <div>
              <h1>Title: {task.title}</h1>
              <h1>Description: {task.description}</h1>
              <h1>Priority: {task.priority}</h1>
              <h1>Status: {task.status}</h1>

            </div>
          );
        })}
      </div>

      <div>
        <input
          type="text"
          placeholder="Title..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Description..."
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Priority..."
          onChange={(event) => {
            setPriority(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Status..."
          onChange={(event) => {
            setStatus(event.target.value);
          }}
        />
        <button onClick={createTask}> Create Task </button>
      </div>
    </div>
  );
}

export default App;