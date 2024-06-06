const request = require('supertest');
const app = require('./index'); // Adjust the path to your Express app

const defaultAdmin = { emailOrPhone: 'real@gmail.com', password: 'test123' }
afterAll(async () => {
  console.log("Test done");
});

describe('POST /users', () => {
  it('should return paginated users', async () => {
    // Create some test users
    const authres = await request(app)
      .post('/auth/login')
      .send(defaultAdmin);

    expect(authres.statusCode).toEqual(200);

    await request(app).post('/users')
      .set('authorization', `Bearer ${authres.body.token}`)
      .send({ name: 'John Doe', email: 'john@example.com', password: 'password', passwordConfirm: "password", isAdmin: false, company: "company", phoneNumber: '1234567890' });

    await request(app).post('/users')
      .set('authorization', `Bearer ${authres.body.token}`)
      .send({ name: 'Jane Doe', email: 'jane@example.com', password: 'password', passwordConfirm: "password", isAdmin: false, company: "company", phoneNumber: '0987654321' });

    const res = await request(app)
      .get('/users').query({ page: 1 })
      .set('authorization', `Bearer ${authres.body.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.meta).toHaveProperty('totalPages');
  });

  it('should search users by name', async () => {
    const authres = await request(app)
      .post('/auth/login')
      .send(defaultAdmin);

    expect(authres.statusCode).toEqual(200);

    const res = await request(app).get('/users')
      .set('authorization', `Bearer ${authres.body.token}`)
      .query({ search: 'John' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.users.length).toBe(1);
    expect(res.body.data.users[0].name).toBe('John Doe');
  });
});
