import React, { useState } from 'react';
import RemarksBoard from '../components/remarksboard';

const Timesheet = () => {
  // 1. STATE: Form Data (For adding new tasks)
  const [taskForm, setTaskForm] = useState({
    title: "",        // This maps to "To Do"
    project: "",
    allottedBy: "",
    timeRequired: "",
    description: "",
    deadline: ""      // Date input by user
  });

  // 2. STATE: List of Tasks (The Planner)
  // Initial dummy data to show how it looks
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design Home Page",
      project: "Website Redesign",
      allottedBy: "Manager John",
      timeRequired: "4 Hours",
      deadline: "2023-12-25",
      description: "Create Figma mockup"
    }
  ]);

  // Handle Input Change
  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  // Handle Add Task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.project) {
      alert("Please fill in at least Title and Project!");
      return;
    }

    const newTask = {
      id: Date.now(), // Generate unique ID based on timestamp
      ...taskForm
    };

    setTasks([...tasks, newTask]); // Add to list
    // Reset form
    setTaskForm({ title: "", project: "", allottedBy: "", timeRequired: "", description: "", deadline: "" });
  };

  // Handle Delete Task
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div>
      <h2>📅 Task Planner & Timesheet</h2>
      
      {/* SECTION 1: ADD NEW TASK FORM */}
      <div className="card" style={{ marginBottom: '30px', textAlign: 'left' }}>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>➕ Add New Task</h3>
        
        <form onSubmit={handleAddTask}>
          <div style={styles.gridContainer}>
            
            {/* Row 1 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Task Title (To Do):</label>
              <input type="text" name="title" value={taskForm.title} onChange={handleChange} style={styles.input} placeholder="e.g. Fix Login Bug" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Project Name:</label>
              <input type="text" name="project" value={taskForm.project} onChange={handleChange} style={styles.input} placeholder="e.g. SyncFlow App" />
            </div>

            {/* Row 2 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Allotted By:</label>
              <input type="text" name="allottedBy" value={taskForm.allottedBy} onChange={handleChange} style={styles.input} placeholder="e.g. Team Lead" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Time Required:</label>
              <input type="text" name="timeRequired" value={taskForm.timeRequired} onChange={handleChange} style={styles.input} placeholder="e.g. 2 Hours" />
            </div>

            {/* Row 3 */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Deadline:</label>
              <input type="date" name="deadline" value={taskForm.deadline} onChange={handleChange} style={styles.input} />
            </div>

            {/* Work Description (Full Width) */}
            <div style={{ ...styles.formGroup, gridColumn: 'span 2' }}>
              <label style={styles.label}>Work Description:</label>
              <textarea name="description" value={taskForm.description} onChange={handleChange} style={{ ...styles.input, height: '60px' }} placeholder="Brief details about the task..." />
            </div>

          </div>

          <div style={{ textAlign: 'right', marginTop: '15px' }}>
            <button type="submit" style={styles.addBtn}>Add Task to Planner</button>
          </div>
        </form>
      </div>

      {/* SECTION 2: TASK PLANNER LIST (With Delete Option) */}
      <div className="card" style={{ marginBottom: '30px', padding: '0' }}>
        <h3 style={{ padding: '20px 20px 10px 20px', margin: 0, textAlign: 'left' }}>📋 Task List</h3>
        
        <div className="table-responsive">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8f9fa" }}>
            <tr style={{ textAlign: "left" }}>
              <th style={styles.th}>Project</th>
              <th style={styles.th}>To Do (Task)</th>
              <th style={styles.th}>Allotted By</th>
              <th style={styles.th}>Deadline</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={styles.td} data-label="Project">{task.project}</td>
                  <td style={styles.td} data-label="Task">
                    <strong>{task.title}</strong><br/>
                    <small style={{color:'gray'}}>{task.description}</small>
                  </td>
                  <td style={styles.td} data-label="Allotted By">{task.allottedBy}</td>
                  <td style={styles.td} data-label="Deadline"><span style={{color: 'red'}}>{task.deadline}</span></td>
                  <td style={styles.td} data-label="Time">{task.timeRequired}</td>
                  <td style={styles.td} data-label="Action">
                    <button 
                      onClick={() => handleDelete(task.id)} 
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "gray" }}>
                  No tasks added yet. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* SECTION 3: WHITEBOARD */}
      <RemarksBoard pageName="Timesheet Planner" />
    </div>
  );
};

// --- STYLES ---
const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#34495e',
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: '5px 10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  th: {
    padding: '15px',
    color: '#555',
    fontSize: '14px',
    borderBottom: '2px solid #ddd'
  },
  td: {
    padding: '15px',
    fontSize: '14px',
    verticalAlign: 'top'
  }
};

export default Timesheet;