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
    <div className="dashboard-page">
      <div className="page-header">
        <h2 className="page-title">📅 Task Planner & Timesheet</h2>
        <p className="page-subtitle">Track your tasks, deadlines, and timesheet entries.</p>
      </div>
      
      {/* SECTION 1: ADD NEW TASK FORM */}
      <div className="card">
        <h3 className="content-title">➕ Add New Task</h3>
        
        <form onSubmit={handleAddTask}>
          <div className="grid-form">
            
            {/* Row 1 */}
            <div className="form-group">
              <label className="form-label">Task Title (To Do):</label>
              <input type="text" name="title" value={taskForm.title} onChange={handleChange} className="form-input" placeholder="e.g. Fix Login Bug" />
            </div>

            <div className="form-group">
              <label className="form-label">Project Name:</label>
              <input type="text" name="project" value={taskForm.project} onChange={handleChange} className="form-input" placeholder="e.g. SyncFlow App" />
            </div>

            {/* Row 2 */}
            <div className="form-group">
              <label className="form-label">Allotted By:</label>
              <input type="text" name="allottedBy" value={taskForm.allottedBy} onChange={handleChange} className="form-input" placeholder="e.g. Team Lead" />
            </div>

            <div className="form-group">
              <label className="form-label">Time Required:</label>
              <input type="text" name="timeRequired" value={taskForm.timeRequired} onChange={handleChange} className="form-input" placeholder="e.g. 2 Hours" />
            </div>

            {/* Row 3 */}
            <div className="form-group">
              <label className="form-label">Deadline:</label>
              <input type="date" name="deadline" value={taskForm.deadline} onChange={handleChange} className="form-input" />
            </div>

            {/* Work Description (Full Width) */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Work Description:</label>
              <textarea name="description" value={taskForm.description} onChange={handleChange} className="form-input" style={{ height: '60px', resize: 'none' }} placeholder="Brief details about the task..." />
            </div>

          </div>

          <div className="page-text-right" style={{ marginTop: '15px' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Task to Planner'}</button>
          </div>
        </form>
      </div>

      {/* SECTION 2: TASK PLANNER LIST (With Delete Option) */}
      <div className="card">
        <h3 className="content-title">📋 Task List</h3>
        
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>To Do (Task)</th>
                <th>Allotted By</th>
                <th>Deadline</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="small-muted" style={{ textAlign: "center", padding: "20px" }}>
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && tasks.length > 0 && tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.projectName || '—'}</td>
                  <td>
                    <strong>{task.title}</strong><br/>
                    <small className="small-muted">{task.description}</small>
                  </td>
                  <td>{task.allottedBy || '—'}</td>
                  <td><span className="status-badge">{task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</span></td>
                  <td>{task.timeRequired || '—'}</td>
                  <td>
                    <button onClick={() => handleDelete(task._id)} className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
              {!loading && tasks.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "gray" }}>
                    No tasks yet. Add one above (login required).
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

export default Timesheet;