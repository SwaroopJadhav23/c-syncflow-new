import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });
  const [holidayForm, setHolidayForm] = useState({ name: '', date: '' });

  const token = localStorage.getItem('token');
  const API = 'http://localhost:5000/api';

  useEffect(() => {
    if (!token) return;
    fetchUsers();
    fetchProjects();
    fetchIssues();
    fetchTasks();
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${API}/leaves/all`, { headers: { Authorization: `Bearer ${token}` } });
      setLeaves(res.data);
    } catch (err) {
      setLeaves([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  // Additional state for project assignment and task creation
  const [assignForm, setAssignForm] = useState({ projectId: '', userIds: [] });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium', projectId: '' });

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignForm.projectId || assignForm.userIds.length === 0) return alert('Select a project and at least one user');
    try {
      await axios.post(`http://localhost:5000/api/admin/projects/${assignForm.projectId}/assign`, { userIds: assignForm.userIds }, { headers: { Authorization: `Bearer ${token}` } });
      fetchProjects();
      setAssignForm({ projectId: '', userIds: [] });
    } catch (err) {
      console.error(err);
      alert('Assignment failed');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/tasks/create`, taskForm, { headers: { Authorization: `Bearer ${token}` } });
      setTaskForm({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium', projectId: '' });
      fetchTasks();
      alert('Task created');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Task creation failed');
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/issues', { headers: { Authorization: `Bearer ${token}` } });
      setIssues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks/all', { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete handlers
  const handleDeleteProject = async (projectId) => {
    if (!confirm('Delete this project and its tasks?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProjects();
      fetchTasks();
      alert('Project deleted');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to delete project');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
      alert('Task deleted');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to delete task');
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!confirm('Delete this issue?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/issues/${issueId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchIssues();
      alert('Issue deleted');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Failed to delete issue');
    }
  };

  const handleCleanupE2E = async () => {
    if (!confirm('Run cleanup for E2E data? This will delete E2E-created users/projects/tasks/issues.')) return;
    try {
      const res = await axios.post('http://localhost:5000/api/admin/cleanup-e2e', {}, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Cleanup done: users=${res.usersDeleted}, projects=${res.projectsDeleted}, tasks=${res.tasksDeleted}, issues=${res.issuesDeleted}`);
      fetchUsers();
      fetchProjects();
      fetchTasks();
      fetchIssues();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Cleanup failed');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/projects`, projectForm, { headers: { Authorization: `Bearer ${token}` } });
      setProjectForm({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Project creation failed');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/notices`, noticeForm, { headers: { Authorization: `Bearer ${token}` } });
      setNoticeForm({ title: '', content: '' });
      alert('Notice created');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed');
    }
  };

  const handleCreateHoliday = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/holidays`, holidayForm, { headers: { Authorization: `Bearer ${token}` } });
      setHolidayForm({ name: '', date: '' });
      alert('Holiday created');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed');
    }
  };

  const handleLeaveStatus = async (leaveId, status) => {
    try {
      await axios.put(`${API}/leaves/${leaveId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Panel</h2>
        <div>
          <button onClick={handleCleanupE2E} style={{ background: '#e74c3c', color: '#fff', padding: '6px 10px', border: 'none', borderRadius: '6px' }}>
            Cleanup E2E Data
          </button>
        </div>
      </div>
      <section>
        <h3>Users</h3>
        <ul>
          {users.map(u => <li key={u._id}>
            {u.username} — {u.email} — {u.role}
            <button onClick={() => { if (confirm('Delete this user?')) axios.delete(`http://localhost:5000/api/admin/users/${u._id}`, { headers: { Authorization: `Bearer ${token}` } }).then(()=>{fetchUsers();fetchTasks();}).catch(e=>alert('Delete failed')) }} style={{ marginLeft: 8 }}>Delete</button>
          </li>)}
        </ul>
      </section>

      <section>
        <h3>Create Project</h3>
        <form onSubmit={handleCreateProject}>
          <input required placeholder="Name" value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} />
          <input placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
          <button type="submit">Create</button>
        </form>
        <h4>Projects</h4>
        <ul>
          {projects.map(p => <li key={p._id}>
            <strong>{p.name}</strong> — Assigned: {(p.assignedTo || []).map(a => a.username).join(', ')}
            <div style={{ marginTop: 6 }}>
              <button onClick={() => setAssignForm({ ...assignForm, projectId: p._id })}>Select for Assignment</button>
              <button onClick={() => handleDeleteProject(p._id)} style={{ marginLeft: 8, background: '#e74c3c', color: '#fff' }}>Delete Project</button>
            </div>
          </li>)}
        </ul>
        <div style={{ marginTop: '12px' }}>
          <h4>Assign Users to Project</h4>
          <form onSubmit={handleAssign}>
            <select value={assignForm.projectId} onChange={e => setAssignForm({ ...assignForm, projectId: e.target.value })}>
              <option value="">Select Project</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select multiple value={assignForm.userIds} onChange={e => setAssignForm({ ...assignForm, userIds: Array.from(e.target.selectedOptions).map(o => o.value) })}>
              {users.map(u => <option key={u._id} value={u._id}>{u.username} ({u.email})</option>)}
            </select>
            <button type="submit">Assign</button>
          </form>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>Create Task (with Priority)</h4>
          <form onSubmit={handleCreateTask}>
            <input required placeholder="Title" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
            <input placeholder="Description" value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
            <select value={taskForm.projectId} onChange={e => setTaskForm({ ...taskForm, projectId: e.target.value })}>
              <option value="">Select Project (optional)</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
              <option value="">Assign to (optional)</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
            </select>
            <input type="date" value={taskForm.deadline} onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })} />
            <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit">Create Task</button>
          </form>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4>All Tasks</h4>
          <ul>
            {tasks.map(t => <li key={t._id}>
              <strong>{t.title}</strong> — {t.priority} — Assigned: {t.assignedTo || t.assignedTo === 'Unassigned' ? (t.assignedTo || 'Unassigned') : t.assignedTo}
              <button onClick={() => handleDeleteTask(t._id)} style={{ marginLeft: 8, background: '#e74c3c', color: '#fff' }}>Delete Task</button>
            </li>)}
          </ul>
        </div>
      </section>

      <section>
        <h3>Issues</h3>
        <ul>
          {issues.map(i => <li key={i._id}>
            {i.title} — {i.priority} — {i.status} — reported by {i.reportedBy?.username}
            <button onClick={() => handleDeleteIssue(i._id)} style={{ marginLeft: 8, background: '#e74c3c', color: '#fff' }}>Delete Issue</button>
          </li>)}
        </ul>
      </section>

      <section>
        <h3>Create Notice</h3>
        <form onSubmit={handleCreateNotice} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input required placeholder="Title" value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} />
          <input placeholder="Content" value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })} />
          <button type="submit">Create Notice</button>
        </form>
      </section>

      <section>
        <h3>Create Holiday</h3>
        <form onSubmit={handleCreateHoliday} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input required placeholder="Name" value={holidayForm.name} onChange={e => setHolidayForm({ ...holidayForm, name: e.target.value })} />
          <input type="date" required value={holidayForm.date} onChange={e => setHolidayForm({ ...holidayForm, date: e.target.value })} />
          <button type="submit">Create Holiday</button>
        </form>
      </section>

      <section>
        <h3>Leave Requests</h3>
        <ul>
          {leaves.map(l => <li key={l._id}>
            {l.user?.username} — {l.type} — {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()} — <strong>{l.status}</strong>
            {l.status === 'pending' && (
              <>
                <button onClick={() => handleLeaveStatus(l._id, 'approved')} style={{ marginLeft: 8, background: '#27ae60', color: '#fff' }}>Approve</button>
                <button onClick={() => handleLeaveStatus(l._id, 'rejected')} style={{ marginLeft: 4, background: '#e74c3c', color: '#fff' }}>Reject</button>
              </>
            )}
          </li>)}
          {leaves.length === 0 && <li style={{ color: 'gray' }}>No leave requests</li>}
        </ul>
      </section>
    </div>
  );
};

export default Admin;


