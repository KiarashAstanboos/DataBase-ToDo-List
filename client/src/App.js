import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [listOfTasks, setListOfTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [status, setStatus] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState(0);
  const [editStatus, setEditStatus] = useState(0);

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
        response.data,
      ]);
    });
  };

  const editTask = (id) => {
    Axios.put(`http://localhost:3000/editTask/${id}`, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      status: editStatus,
    }).then((response) => {
      setListOfTasks(listOfTasks.map(task => task._id === id ? response.data : task));
      setEditId(null);
    });
  };

  const deleteTask = (id) => {
    Axios.delete(`http://localhost:3000/deleteTask/${id}`).then(() => {
      setListOfTasks(listOfTasks.filter((task) => task._id !== id));
    });
  };

  return (
    <div className="App">
      <div className="tasksDisplay">
        {listOfTasks.map((task) => {
          return (
            <div key={task._id}>
              {editId === task._id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    placeholder="Edit Title..."
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    placeholder="Edit Description..."
                  />
                  <input
                    type="number"
                    value={editPriority}
                    onChange={(event) => setEditPriority(event.target.value)}
                    placeholder="Edit Priority..."
                  />
                  <input
                    type="number"
                    value={editStatus}
                    onChange={(event) => setEditStatus(event.target.value)}
                    placeholder="Edit Status..."
                  />
                  <button onClick={() => editTask(task._id)}>Save</button>
                </div>
              ) : (
                <div>
                  <h1>Title: {task.title}</h1>
                  <h1>Description: {task.description}</h1>
                  <h1>Priority: {task.priority}</h1>
                  <h1>Status: {task.status}</h1>
                  <button onClick={() => {
                    setEditId(task._id);
                    setEditTitle(task.title);
                    setEditDescription(task.description);
                    setEditPriority(task.priority);
                    setEditStatus(task.status);
                  }}>Edit</button>
                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              )}
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
