import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import CalendarComponent from './CalendarComponent';
import './App.css';

function App() {
  const [listOfTasks, setListOfTasks] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Daily");
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
  const [filterType, setFilterType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchTasksAndCompletion = () => {
    Axios.get(`http://localhost:3001/getTasks/${selectedCategory}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const sortedTasks = sortTasks(response.data, sortType);
        setListOfTasks(sortedTasks);
        updateCompletionPercentage(sortedTasks);
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
  }, [isLoggedIn, token, sortType, selectedCategory]);

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

  const createTask = () => {
    Axios.post(
      "http://localhost:3001/createTask",
      {
        title,
        description,
        category,
        priority,
        dueDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      const newTaskList = [...listOfTasks, response.data];
      setListOfTasks(newTaskList);
      updateCompletionPercentage(newTaskList);
      setTitle("");
      setDescription("");
      setCategory("Daily");
      setPriority(3);
      setDueDate("");
    });
  };

  const updateTaskStatus = (id, status) => {
    Axios.put(
      `http://localhost:3001/editTask/${id}`,
      { status: status ? 1 : 0 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        const updatedTasks = listOfTasks.map((task) =>
          task._id === id ? { ...task, status: status ? 1 : 0 } : task
        );
        setListOfTasks(updatedTasks);
        updateCompletionPercentage(updatedTasks);
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };

  const deleteTask = (id) => {
    Axios.delete(`http://localhost:3001/deleteTask/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      const updatedTasks = listOfTasks.filter((task) => task._id !== id);
      setListOfTasks(updatedTasks);
      updateCompletionPercentage(updatedTasks);
    });
  };

  const editTask = (id) => {
    Axios.put(
      `http://localhost:3001/editTask/${id}`,
      {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        priority: editPriority,
        dueDate: editDueDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(() => {
      const updatedTasks = listOfTasks.map((task) =>
        task._id === id
          ? {
              ...task,
              title: editTitle,
              description: editDescription,
              category: editCategory,
              priority: editPriority,
              dueDate: editDueDate,
            }
          : task
      );
      setListOfTasks(updatedTasks);
      updateCompletionPercentage(updatedTasks);
      setEditId(null);
    });
  };

  const sortTasks = (tasks, sortType) => {
    switch (sortType) {
      case "priority":
        return tasks.sort((a, b) => a.priority - b.priority);
      default:
        return tasks;
    }
  };

  const updateCompletionPercentage = (tasks) => {
    const completedTasks = tasks.filter((task) => task.status === 1).length;
    const totalTasks = tasks.length;
    const percentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    setCompletionPercentage(percentage.toFixed(2));
  };

  const filteredTasks = listOfTasks.filter((task) => {
    switch (filterType) {
      case "Completed":
        return task.status === 1;
      case "Pending":
        return task.status === 0;
      default:
        return true;
    }
  });

  const handlePriorityChange = (value, setter) => {
    if (value >= 1 && value <= 3) {
      setter(value);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === "All" ? category : category);
    fetchTasksAndCompletion();
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="login-register">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={register}>Register</button>

          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <header>
            <h1>Task Manager</h1>
          </header>
          <div className="progressBar">
            <div
              className="progress"
              style={{ width: `${completionPercentage}%` }}
            >{`${completionPercentage}% Complete`}</div>
          </div>
          <div className="task-filter">
            <label>
              Filter by status:
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </label>
            <label>
              Sort by:
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="priority">Priority</option>
              </select>
            </label>
          </div>
          <div className="createTask">
            <h2>Create Task</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <label>
                Category:
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </label>
              <label>
                Priority:
                <input
                  type="number"
                  value={priority}
                  min="1"
                  max="3"
                  onChange={(e) =>
                    handlePriorityChange(parseInt(e.target.value), setPriority)
                  }
                />
              </label>
              <label>
                Due Date:
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>
            </div>
            <button onClick={createTask}>Create Task</button>
          </div>
          <div className="task-list">
            <h2>Task List</h2>
            {filteredTasks.map((task) => (
              <div key={task._id} className="task">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Category: {task.category}</p>
                <p>Priority: {task.priority}</p>
                <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Status: {task.status === 1 ? "Completed" : "Pending"}</p>
                <button onClick={() => updateTaskStatus(task._id, !task.status)}>
                  {task.status === 1 ? "Mark as Pending" : "Mark as Completed"}
                </button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
                {editId === task._id ? (
                  <div className="editTask">
                    <h2>Edit Task</h2>
                    <input
                      type="text"
                      placeholder="Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <label>
                      Category:
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </label>
                    <label>
                      Priority:
                      <input
                        type="number"
                        value={editPriority}
                        min="1"
                        max="3"
                        onChange={(e) =>
                          handlePriorityChange(
                            parseInt(e.target.value),
                            setEditPriority
                          )
                        }
                      />
                    </label>
                    <label>
                      Due Date:
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />
                    </label>
                    <button onClick={() => editTask(task._id)}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setEditId(task._id)}>Edit</button>
                )}
              </div>
            ))}
          </div>
          <CalendarComponent tasks={listOfTasks} />
        </div>
      )}
    </div>
  );
}

export default App;
