const request = require('supertest');
const app = require('../server');

describe('Root route', () => {
  test('GET / should return 200 and running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Backend is Running/);
  });
});



