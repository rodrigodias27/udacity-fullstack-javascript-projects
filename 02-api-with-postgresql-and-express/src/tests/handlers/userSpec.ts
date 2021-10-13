import supertest from 'supertest';
import app from '../../server';
import client from '../../database';
import { UserStore } from '../../models/user';

const request = supertest(app);
const store = new UserStore();

const authAdmin = async () => {
  const result = await request
    .post('/users/authenticate/')
    .send({first_name: 'Doctor', last_name: 'Who', password: 'Trenzalore'});
  const token = result.body;
  return token
}

const authUser = async () => {
  const result = await request
    .post('/users/authenticate/')
    .send({first_name: 'Clara', last_name: 'Oswald', password: 'pinkhusband'});
  const token = result.body;
  return token
}

describe('User endpoints', () => {

  beforeEach(async () => {
    // Setup: create an user
    await store.create({
      id: 1,
      first_name: 'Doctor',
      last_name: 'Who',
      password_digest: '',
      role: 'admin',
    },
    'Trenzalore');
    await store.create({
      id: 2,
      first_name: 'Clara',
      last_name: 'Oswald',
      password_digest: '',
      role: 'user',
    },
    'pinkhusband')
  });

  afterEach(async () => {
    // Clean table users
    const conn = await client.connect();
    const sql = 'TRUNCATE TABLE users cascade;' +
      'ALTER SEQUENCE users_id_seq RESTART WITH 1;';
    const result = await conn.query(sql);
    conn.release();
  });

  describe('POST /users/', () => {
    it('should add an user', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .post('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          first_name: 'Rose',
          last_name: 'Tyler',
          role: 'user',
          password: 'badwolf'
        });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      // First user
      expect(resBody.id).toEqual(3)
      expect(resBody.first_name).toEqual('Rose')
      expect(resBody.last_name).toEqual('Tyler')
      expect(resBody.password_digest).toBeDefined()
      expect(resBody.role).toEqual('user')
    });

    it('should return 400 if first_name and last_name already exists', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .post('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          first_name: 'Clara',
          last_name: 'Oswald',
          role: 'admin',
          password: 'dannypink'
        });
      // Assert
      expect(result.status).toBe(400)
    });

    it('should return 400 if role is different from "user" and "admin"', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .post('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          first_name: 'Rose',
          last_name: 'Tyler',
          role: 'superuser',
          password: 'badwolf'
        });
      // Assert
      expect(result.status).toBe(400)
    });

    it('should return 401 if it is an user token', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .post('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          first_name: 'Rose',
          last_name: 'Tyler',
          role: 'superuser',
          password: 'badwolf'
        });
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
        .post('/users/')
        .send({
          first_name: 'Rose',
          last_name: 'Tyler',
          role: 'superuser',
          password: 'badwolf'
        });
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('GET /users/', () => {
    it('should return a list of users', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .get('/users/')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.length).toEqual(2)
      // First user
      expect(resBody[0].id).toEqual(1)
      expect(resBody[0].first_name).toEqual('Doctor')
      expect(resBody[0].last_name).toEqual('Who')
      expect(resBody[0].password_digest).toBeDefined()
      expect(resBody[0].role).toEqual('admin')
      // Second user
      expect(resBody[1].id).toEqual(2)
      expect(resBody[1].first_name).toEqual('Clara')
      expect(resBody[1].last_name).toEqual('Oswald')
      expect(resBody[1].password_digest).toBeDefined()
      expect(resBody[1].role).toEqual('user')
    });

    it('should return 401 if it is an user token', async () => {
      const token = await authUser();
      const result = await request
        .get('/users/')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request.get('/users/')
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('GET /users/:id', () => {
    it('should return the correct user', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .get('/users/1')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(1)
      expect(resBody.first_name).toEqual('Doctor')
      expect(resBody.last_name).toEqual('Who')
      expect(resBody.password_digest).toBeDefined()
      expect(resBody.role).toEqual('admin')
    });

    it('should return 404 if user_id doesn\'t exists', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .get('/users/999')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(404)
    });

    it('should return 401 if it is a token user', async () => {
      const token = await authUser();
      const result = await request
        .get('/users/1')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request.get('/users/1')
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('PUT /users/', () => {
    it('should update an user', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .put('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 1,
          first_name: 'Missy',
          last_name: 'The Master',
          password: 'Gallifrey'
        });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(1)
      expect(resBody.first_name).toEqual('Missy')
      expect(resBody.last_name).toEqual('The Master')
      expect(resBody.password_digest).toBeDefined()
      expect(resBody.role).toEqual('admin')
    });

    it('should return 400 if first_name and last_name is equal another user', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .put('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 1,
          first_name: 'Clara',
          last_name: 'Oswald',
          password: 'pinkman',
        });
      // Assert
      expect(result.status).toBe(400)
    });

    it('should return 401 if token is different from user in body', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .put('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 1,
          first_name: 'Missy',
          last_name: 'The Master',
          password: 'Gallifrey'
        });
      // Assert
      expect(result.status).toBe(401)
    });

    it('should remove the user if token is from same user in body', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .put('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 2,
          first_name: 'Missy',
          last_name: 'The Master',
          password: 'Gallifrey'
        });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(2)
      expect(resBody.first_name).toEqual('Missy')
      expect(resBody.last_name).toEqual('The Master')
      expect(resBody.password_digest).toBeDefined()
      expect(resBody.role).toEqual('user')
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
        .put('/users/')
        .send({
          id: 1,
          first_name: 'Missy',
          last_name: 'The Master',
          password: 'Gallifrey'
        });
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('POST /users/authenticate', () => {
    it('should return user jwt if password is correct', async () => {
      // Act
      const result = await request
        .post('/users/authenticate/')
        .send({
          first_name: 'Doctor',
          last_name: 'Who',
          password: 'Trenzalore'
        })
      // Assert
      expect(result.status).toBe(200)
      expect(result.body).toBeDefined()
    });

    it('should return 401 if password is incorrect', async () => {
      // Act
      const result = await request
        .post('/users/authenticate/')
        .send({
          first_name: 'Doctor',
          last_name: 'Who',
          password: 'Gallifrey'
        })
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if user does not exists', async () => {
      // Act
      const result = await request
        .post('/users/authenticate/')
        .send({
          first_name: 'Missy',
          last_name: 'The Master',
          password: 'Gallifrey'
        })
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('DELETE /users/', () => {
    it('should remove the user', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .delete('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ id: 2 });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(2)
      expect(resBody.first_name).toEqual('Clara')
      expect(resBody.last_name).toEqual('Oswald')
      expect(resBody.password_digest).toBeDefined()
      expect(resBody.role).toEqual('user')
      // Check GET /users/:id
      await request
        .get('/users/2')
        .set({'Authorization': `Bearer ${token}`})
        .expect(404);
    });

    it('should remove the user if token is from same user in body', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .delete('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ id: 2 });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(2)
      expect(resBody.first_name).toEqual('Clara')
      expect(resBody.last_name).toEqual('Oswald')
      expect(resBody.password_digest).toBeDefined()
      expect(resBody.role).toEqual('user')
      // Check GET /users/:id
      const adminToken = await authAdmin();
      await request
        .get('/users/2')
        .set({'Authorization': `Bearer ${adminToken}`})
        .expect(404);
    });

    it('should return 401 if token is different from user in body', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .delete('/users/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ id: 1 });
      // Assert
      expect(result.status).toBe(401);
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
        .delete('/users/')
        .send({ id: 2 });
      // Assert
      expect(result.status).toBe(401);
    });
  });
})
