import React, { useState } from 'react';

const TaskForm = () => {
  // State to hold input data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // This sends the data to your backend
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Data saved! Check MongoDB Compass.");
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Failed to connect to server:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="assignedTo" placeholder="Assigned To" onChange={handleChange} />
      <input type="date" name="deadline" onChange={handleChange} />
      <button type="submit">Submit to MongoDB</button>
    </form>
  );
};

export default TaskForm;