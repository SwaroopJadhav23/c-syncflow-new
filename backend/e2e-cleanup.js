const axios = require('axios');

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

async function post(path, data, token) {
  const res = await axios.post(`${baseUrl}${path}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}

async function login(email, password) {
  const res = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
  return res.data.token;
}

async function run() {
  try {
    const adminToken = await login('e2e-admin@example.com', 'Password123!');
    console.log('Admin token obtained, requesting cleanup...');
    const result = await post('/api/admin/cleanup-e2e', {}, adminToken);
    console.log('Cleanup result:', result);
  } catch (err) {
    console.error('Cleanup failed:', err.response?.data || err.message);
    process.exitCode = 1;
  }
}

run();



