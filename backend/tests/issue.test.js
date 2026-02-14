const request = require('supertest');
const app = require('../server');

describe('Issue routes', () => {
  test('POST /api/issues/report without token should return 401', async () => {
    const res = await request(app)
      .post('/api/issues/report')
      .send({ title: 'Test issue', description: 'desc' });
    expect([401, 403]).toContain(res.statusCode); // token missing -> 401 expected
  });
});


