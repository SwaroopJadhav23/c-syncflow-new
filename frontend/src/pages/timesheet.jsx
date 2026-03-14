import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RemarksBoard from '../components/remarksboard';

const API = 'http://localhost:5000/api/tasks';
const token = () => localStorage.getItem('token');

const Timesheet = () => {
  const [taskForm, setTaskForm] = useState({
    title: "",
    project: "",
    allottedBy: "",
    timeRequired: "",
    description: "",
    deadline: ""
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = () => {
    if (!token()) { setLoading(false); return; }
    axios.get(`${API}/my`, { headers: { Authorization: `Bearer ${token()}` } })
      .then((res) => setTasks(res.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) {
      alert("Please fill in at least Title!");
      return;
    }
    if (!token()) { alert("Please login to add tasks."); return; }
    setSubmitting(true);
    try {
      await axios.post(`${API}/my`, {
        title: taskForm.title,
        projectName: taskForm.project,
        allottedBy: taskForm.allottedBy,
        timeRequired: taskForm.timeRequired,
        description: taskForm.description,
        deadline: taskForm.deadline || undefined
      }, { headers: { Authorization: `Bearer ${token()}` } });
      setTaskForm({ title: "", project: "", allottedBy: "", timeRequired: "", description: "", deadline: "" });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    if (!token()) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete");
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
            <button type="submit" style={styles.addBtn} disabled={submitting}>{submitting ? 'Adding...' : 'Add Task to Planner'}</button>
          </div>
        </form>
      </div>

      {/* SECTION 2: TASK PLANNER LIST (With Delete Option) */}
      <div className="card" style={{ marginBottom: '30px', padding: '0' }}>
        <h3 style={{ padding: '20px 20px 10px 20px', margin: 0, textAlign: 'left' }}>📋 Task List</h3>
        
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
            {loading ? (
              <tr><td colSpan="6" style={{ padding: "20px", textAlign: "center" }}>Loading...</td></tr>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={styles.td}>{task.projectName || '—'}</td>
                  <td style={styles.td}>
                    <strong>{task.title}</strong><br/>
                    <small style={{color:'gray'}}>{task.description}</small>
                  </td>
                  <td style={styles.td}>{task.allottedBy || '—'}</td>
                  <td style={styles.td}><span style={{color: 'red'}}>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</span></td>
                  <td style={styles.td}>{task.timeRequired || '—'}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleDelete(task._id)} style={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "gray" }}>
                  No tasks yet. Add one above (login required).
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    gridTemplateColumns: '1fr 1fr',
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