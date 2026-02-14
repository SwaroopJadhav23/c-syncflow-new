const axios = require('axios');

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

async function safePost(path, data, token) {
  try {
    const res = await axios.post(`${baseUrl}${path}`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    console.log(`POST ${path} => ${res.status}`);
    return res.data;
  } catch (err) {
    console.error(`POST ${path} failed:`, err.response?.data || err.message);
    throw err;
  }
}

async function safeGet(path, token) {
  try {
    const res = await axios.get(`${baseUrl}${path}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    console.log(`GET ${path} => ${res.status}`);
    return res.data;
  } catch (err) {
    console.error(`GET ${path} failed:`, err.response?.data || err.message);
    throw err;
  }
}

async function run() {
  console.log('Starting E2E script against', baseUrl);

  // 1. Create admin user
  const adminCreds = { username: 'E2E Admin', employeeId: 'ADM001', email: 'e2e-admin@example.com', password: 'Password123!', role: 'admin' };
  try {
    await safePost('/api/auth/register', adminCreds);
  } catch (e) {
    console.log('Admin registration may already exist; continuing.');
  }

  // 2. Create regular user
  const userCreds = { username: 'E2E User', employeeId: 'EMP001', email: 'e2e-user@example.com', password: 'Password123!', role: 'employee' };
  try {
    await safePost('/api/auth/register', userCreds);
  } catch (e) {
    console.log('User registration may already exist; continuing.');
  }

  // 3. Login as admin
  const adminLogin = await safePost('/api/auth/login', { email: adminCreds.email, password: adminCreds.password });
  const adminToken = adminLogin.token;
  console.log('Admin logged in, token length:', adminToken?.length || 0);

  // 4. Create a project
  const project = await safePost('/api/admin/projects', { name: 'E2E Project', description: 'Project created during E2E test' }, adminToken);
  console.log('Project created:', project._id);

  // 5. Get users to find E2E User id
  const users = await safeGet('/api/admin/users', adminToken);
  const e2eUser = users.find(u => u.email === userCreds.email);
  if (!e2eUser) throw new Error('E2E user not found in users list');
  console.log('Found E2E user id:', e2eUser._id);

  // 6. Assign user to project
  await safePost(`/api/admin/projects/${project._id}/assign`, { userIds: [e2eUser._id] }, adminToken);
  console.log('Assigned user to project');

  // 7. Create a task with priority, assigned to the user
  const task = await safePost('/api/admin/tasks/create', {
    title: 'E2E Task',
    description: 'Task created during E2E test',
    assignedTo: e2eUser._id,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'high',
    projectId: project._id
  }, adminToken);
  console.log('Task created:', task._id);

  // 8. Login as E2E user and report an issue
  const userLogin = await safePost('/api/auth/login', { email: userCreds.email, password: userCreds.password });
  const userToken = userLogin.token;
  console.log('User logged in, token length:', userToken?.length || 0);

  const issue = await safePost('/api/issues/report', { title: 'E2E Issue', description: 'Reported by E2E user', priority: 'medium' }, userToken);
  console.log('Issue reported:', issue._id);

  console.log('E2E script completed successfully.');
}

run().catch(err => {
  console.error('E2E script failed:', err.message || err);
  process.exitCode = 1;
});


