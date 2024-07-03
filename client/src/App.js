// src/App.js
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import CalendarComponent from './CalendarComponent';
import './App.css';

function App() {
  const [listOfTasks, setListOfTasks] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Daily"); // Default to "Daily"
  const [editCategory, setEditCategory] = useState("");
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState(3);
  const [editDueDate, setEditDueDate] = useState("");
  const [sortType, setSortType] = useState("priority");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [filterType, setFilterType] = useState("All"); // Default to "All"
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch tasks and completion percentage from backend
  const fetchTasksAndCompletion = () => {
    Axios.get(`http://localhost:3001/getTasks/${selectedCategory}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const sortedTasks = sortTasks(response.data, sortType);
        setListOfTasks(sortedTasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });

    Axios.get("http://localhost:3001/completionPercentage", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setCompletionPercentage(response.data.completionPercentage);
      })
      .catch((error) => {
        console.error("Error fetching completion percentage:", error);
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasksAndCompletion();
    }
  }, [isLoggedIn, token, sortType, selectedCategory]); // Dependencies: isLoggedIn, token, sortType

  // User registration
  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username,
      password,
    }).then((response) => {
      setToken(response.data.token);
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    });
  };

  // User login
  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username,
      password,
    }).then((response) => {
      setToken(response.data.token);
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    });
  };

  // User logout
  const logout = () => {
    setIsLoggedIn(false);
    setToken("");
  };

  // Create a new task
  const createTask = () => {
    Axios.post(
      "http://localhost:3001/createTask",
      {
        title,
        description,
        priority,
        status: 0,
        dueDate: dueDate || null,
        category,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      const sortedTasks = sortTasks([...listOfTasks, response.data], sortType);
      setListOfTasks(sortedTasks);
      fetchTasksAndCompletion(); // Fetch updated tasks and completion percentage
      clearInputFields();
    });
  };

  // Clear input fields after creating a task
  const clearInputFields = () => {
    setTitle("");
    setDescription("");
    setPriority(3);
    setDueDate("");
  };

  // Edit an existing task
  const editTask = (id) => {
    Axios.put(
      `http://localhost:3001/editTask/${id}`,
      {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        status: 0,
        dueDate: editDueDate || null,
        category: editCategory,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      const updatedTasks = listOfTasks.map((task) =>
        task._id === id ? response.data : task
      );
      const sortedTasks = sortTasks(updatedTasks, sortType);
      setListOfTasks(sortedTasks);
      fetchTasksAndCompletion(); // Fetch updated tasks and completion percentage
      setEditId(null); // Clear edit mode
    });
  };

  // Delete a task
  const deleteTask = (id) => {
    Axios.delete(`http://localhost:3001/deleteTask/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      const updatedTasks = listOfTasks.filter((task) => task._id !== id);
      const sortedTasks = sortTasks(updatedTasks, sortType);
      setListOfTasks(sortedTasks);
      fetchTasksAndCompletion(); // Fetch updated tasks and completion percentage
    });
  };

  // Update task status (completed or not)
  const updateTaskStatus = (id, status) => {
    Axios.put(
      `http://localhost:3001/editTask/${id}`,
      {
        status: status ? 1 : 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      const updatedTasks = listOfTasks.map((task) =>
        task._id === id ? response.data : task
      );
      const sortedTasks = sortTasks(updatedTasks, sortType);
      setListOfTasks(sortedTasks);
      fetchTasksAndCompletion(); // Fetch updated tasks and completion percentage
    });
  };

  // Handle priority change with validation
  const handlePriorityChange = (value, setPriorityFunc) => {
    const newValue = Math.max(1, Math.min(3, value));
    setPriorityFunc(newValue);
  };

  // Sort tasks based on given criteria
  const sortTasks = (tasks, type) => {
    if (type === "priority") {
      return tasks.sort((a, b) => a.priority - b.priority);
    } else if (type === "status") {
      return tasks.sort((a, b) => a.status - b.status);
    } else if (type === "dueDate") {
      return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    return tasks;
  };

  // Render login/register form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <h1>Login / Register</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  // Render main application when logged in
  return (
    <div className="App">
      <header>
        <h1>Todo List</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="sortButtons">
        <button onClick={() => setSortType("priority")}>
          Sort by Priority
        </button>
        <button onClick={() => setSortType("status")}>Sort by Status</button>
        <button onClick={() => setSortType("dueDate")}>Sort by Due Date</button>
      </div>

      <div className="filterCategory">
        <label>Filter by Category:</label>
        <select onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="All">All</option>
          <option value="Daily">Daily</option>
          <option value="Business">Business</option>
        </select>
      </div>

      <div className="createTaskContainer">
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <input
          type="text"
          placeholder="Description..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <input
          type="number"
          placeholder="Priority..."
          value={priority}
          onChange={(event) =>
            handlePriorityChange(event.target.value, setPriority)
          }
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="Daily">Daily</option>
          <option value="Business">Business</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
        <button onClick={createTask}>Create Task</button>
      </div>

      <div className="listOfTasks">
        {listOfTasks.map((task) => (
          <div key={task._id} className="taskContainer">
            {editId === task._id ? (
              <div className="editTask">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                />
                <input
                  type="number"
                  value={editPriority}
                  onChange={(event) =>
                    handlePriorityChange(event.target.value, setEditPriority)
                  }
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(event) => setEditDueDate(event.target.value)}
                />
                <select
                  value={editCategory}
                  onChange={(event) => setEditCategory(event.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Business">Business</option>
                </select>
                <button onClick={() => editTask(task._id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="task">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status ? "Completed" : "Pending"}</p>
                <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
                <p>Category: {task.category}</p>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
                <button onClick={() => updateTaskStatus(task._id, !task.status)}>
                  {task.status ? "Mark as Pending" : "Mark as Completed"}
                </button>
                <button
                  onClick={() => {
                    setEditId(task._id);
                    setEditTitle(task.title);
                    setEditDescription(task.description);
                    setEditPriority(task.priority);
                    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().substr(0, 10) : "");
                    setEditCategory(task.category);
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="completionPercentage">
        <h3>Completion Percentage: {completionPercentage}%</h3>
      </div>

      <div>
        <CalendarComponent token={token} />
      </div>
    </div>
  );
}

export default App;
