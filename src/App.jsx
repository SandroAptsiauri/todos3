import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    axios
      .get("https://crudapi.co.uk/api/v1/yourusername/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks: ", error);
      });
  }, []);

  const handleChange = (event) => {
    setNewTaskName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newTaskName.trim()) return;

    const newTask = {
      name: newTaskName,
      isCompleted: false,
    };

    axios
      .post("https://crudapi.co.uk/api/v1/yourusername/tasks", newTask)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTaskName("");
      })
      .catch((error) => {
        console.error("Error adding task: ", error);
      });
  };

  const handleToggle = (id, isCompleted) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === id) {
        return { ...task, isCompleted: !isCompleted };
      }
      return task;
    });

    axios
      .put(`https://crudapi.co.uk/api/v1/yourusername/tasks/${id}`, {
        isCompleted: !isCompleted,
      })
      .then(() => {
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://crudapi.co.uk/api/v1/yourusername/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting task: ", error);
      });
  };

  return (
    <div className="App">
      <h1>TODO List</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={newTaskName} onChange={handleChange} />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={task.isCompleted ? "completed" : ""}>
            <span onClick={() => handleToggle(task._id, task.isCompleted)}>
              {task.name}
            </span>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
