import React from 'react';
import axios from 'axios';

const TestTask = () => {

  const sendData = async () => {
    try {
      // This sends a "Package" of data to your backend
      await axios.post('http://localhost:5000/api/tasks/create', {
        title: "Test Task",
        description: "Checking if MongoDB works",
        assignedTo: "EMP01",
        deadline: new Date()
      });
      
      alert("✅ SUCCESS! Check your MongoDB Atlas Collection.");
    } catch (error) {
      alert("❌ FAILED: " + error.message);
    }
  };

  return (
    <button onClick={sendData} style={{ padding: '20px', fontSize: '20px' }}>
      CLICK TO SAVE DATA
    </button>
  );
};

export default TestTask;