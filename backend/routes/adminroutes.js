const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Project = require('../models/project');
const Task = require('../models/task');
const Issue = require('../models/issue');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(verifyToken, requireAdmin);

// List all users (without passwords)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update user role
router.put('/users/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create a project
router.post('/projects', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === '') return res.status(400).json({ msg: 'Project name is required' });
    const project = new Project({ name: name.trim(), description, createdBy: req.user.id });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Assign users to a project
router.post('/projects/:id/assign', async (req, res) => {
  try {
    const { userIds } = req.body; // array of user ObjectId strings
    if (!Array.isArray(userIds) || userIds.length === 0) return res.status(400).json({ msg: 'userIds array required' });
    const project = await Project.findByIdAndUpdate(req.params.id, { $addToSet: { assignedTo: { $each: userIds } } }, { new: true }).populate('assignedTo', 'username email');
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// List projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('assignedTo', 'username email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Admin can create a task with priority and assign to an employee
router.post('/tasks/create', async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority, projectId } = req.body;
    if (!title || title.trim() === '') return res.status(400).json({ msg: 'Task title is required' });
    if (priority && !['low', 'medium', 'high'].includes(priority)) return res.status(400).json({ msg: 'Invalid priority' });
    const newTask = new Task({ title: title.trim(), description, assignedTo, deadline, priority: priority || 'medium', projectId });
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// List all issues reported by users
router.get('/issues', async (req, res) => {
  try {
    const issues = await Issue.find().populate('reportedBy', 'username email');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update issue status (e.g., mark resolved)
router.put('/issues/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    // Optionally remove tasks assigned to this user or mark unassigned
    await Task.updateMany({ assignedTo: req.params.id }, { assignedTo: 'Unassigned' });
    res.json({ msg: 'User deleted', userId: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete project (also optionally delete related tasks)
router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    // Remove tasks linked to this project
    await Task.deleteMany({ projectId: req.params.id });
    res.json({ msg: 'Project and related tasks deleted', projectId: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted', taskId: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete issue
router.delete('/issues/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });
    res.json({ msg: 'Issue deleted', issueId: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Cleanup E2E-created data (admin-only)
router.post('/cleanup-e2e', async (req, res) => {
  try {
    // Users with email like e2e-...@example.com or username starting with 'E2E'
    const userDeleteResult = await User.deleteMany({ $or: [{ email: /e2e-.*@example\.com$/i }, { username: /^E2E\s*/i }] });

    // Projects with name starting with 'E2E'
    const projects = await Project.find({ name: /^E2E/i });
    const projectIds = projects.map(p => p._id);
    const projectDeleteResult = await Project.deleteMany({ _id: { $in: projectIds } });

    // Tasks with title starting with 'E2E' or linked to deleted projects
    const taskDeleteResult = await Task.deleteMany({ $or: [{ title: /^E2E/i }, { projectId: { $in: projectIds } }] });

    // Issues with title starting with 'E2E'
    const issueDeleteResult = await Issue.deleteMany({ title: /^E2E/i });

    res.json({
      usersDeleted: userDeleteResult.deletedCount,
      projectsDeleted: projectDeleteResult.deletedCount,
      tasksDeleted: taskDeleteResult.deletedCount,
      issuesDeleted: issueDeleteResult.deletedCount
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;


