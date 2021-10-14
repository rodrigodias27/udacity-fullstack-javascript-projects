import supertest from 'supertest';
import app from '../../server';
import client from '../../database';
import { UserStore } from '../../models/user';
import { ProductStore } from '../../models/product';

const request = supertest(app);
const store = new ProductStore();
const user_store = new UserStore();

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

describe('Product endpoints', () => {

  beforeEach(async () => {
    // Setup: create an user to auth and a product
    await user_store.create({
      id: 1,
      first_name: 'Doctor',
      last_name: 'Who',
      password_digest: '',
      role: 'admin',
    },
    'Trenzalore');
    await user_store.create({
      id: 2,
      first_name: 'Clara',
      last_name: 'Oswald',
      password_digest: '',
      role: 'user',
    },
    'pinkhusband');
    await store.create({
      id: 1,
      name: 'Lego StarWars',
      price: 5000,
      category: 'Lego'
    });
    await store.create({
      id: 2,
      name: 'Lego Mario',
      price: 50000,
      category: 'Lego'
    });
  });

  afterEach(async () => {
    // Clean table users e products
    const conn = await client.connect();
    const sql = 'TRUNCATE TABLE users cascade;' +
      'ALTER SEQUENCE users_id_seq RESTART WITH 1;' +
      'TRUNCATE TABLE products cascade;' +
      'ALTER SEQUENCE products_id_seq RESTART WITH 1;';
    const result = await conn.query(sql);
    conn.release();
  });

  describe('POST /products/', () => {
    it('should add a product', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .post('/products/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 3,
          name: 'Lego StarWars Deluxe',
          price: 10000,
          category: 'Lego/bricks'
        });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(3)
      expect(resBody.name).toEqual('Lego StarWars Deluxe')
      expect(resBody.price).toEqual(10000)
      expect(resBody.category).toEqual('Lego/bricks')
    });

    it('should return 400 if name already exists', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .post('/products/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 2,
          name: 'Lego StarWars',
          price: 10000,
          category: 'Lego/bricks'
        });
      // Assert
      expect(result.status).toBe(400)
    });

    it('should return 401 if it is an user token', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .post('/products/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 2,
          name: 'Lego StarWars Deluxe',
          price: 10000,
          category: 'Lego/bricks'
        });
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
        .post('/products/')
        .send({
          id: 2,
          name: 'Lego StarWars Deluxe',
          price: 10000,
          category: 'Lego/bricks'
        });
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('GET /products/', () => {
    it('should return a list of products', async () => {
      // Act
      const result = await request.get('/products/')
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.length).toEqual(2)
      // Product id 1
      expect(resBody[0].id).toEqual(1)
      expect(resBody[0].name).toEqual('Lego StarWars')
      expect(resBody[0].price).toEqual(5000)
      expect(resBody[0].category).toEqual('Lego')
      // Product id 2
      expect(resBody[1].id).toEqual(2)
      expect(resBody[1].name).toEqual('Lego Mario')
      expect(resBody[1].price).toEqual(50000)
      expect(resBody[1].category).toEqual('Lego')
    });
  });

  describe('GET /products/:id', () => {
    it('should return the correct product', async () => {
      // Act
      const result = await request.get('/products/1');
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(1)
      expect(resBody.name).toEqual('Lego StarWars')
      expect(resBody.price).toEqual(5000)
      expect(resBody.category).toEqual('Lego')
    });

    it('should return 404 if product_id doesn\'t exists', async () => {
      // Act
      const result = await request.get('/products/999');
      // Assert
      expect(result.status).toBe(404)
    });
  });

  describe('PUT /products/', () => {
    it('should update a product', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .put('/products/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 1,
          name: 'Lego StarWars Deluxe',
          price: 10000,
          category: 'Lego/bricks'
        });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(1)
      expect(resBody.name).toEqual('Lego StarWars Deluxe')
      expect(resBody.price).toEqual(10000)
      expect(resBody.category).toEqual('Lego/bricks')
    });

    it('should return 400 if name is equal another product', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .put('/products/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 2,
          name: 'Lego StarWars',
          price: 7000,
          category: 'Lego',
        });
      // Assert
      expect(result.status).toBe(400)
    });

    it('should return 401 if it is an user token', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .put('/products/')
        .set({'Authorization': `Bearer ${token}`})
        .send({
          id: 2,
          name: 'Lego Mario',
          price: 7000,
          category: 'Lego/bricks'
        });
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
        .put('/products/')
        .send({
          id: 2,
          name: 'Lego Mario',
          price: 7000,
          category: 'Lego/bricks'
        });
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('DELETE /products/', () => {
    it('should remove the product', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .delete('/products/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ id: 2 });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.id).toEqual(2)
      expect(resBody.name).toEqual('Lego Mario')
      expect(resBody.price).toEqual(50000)
      expect(resBody.category).toEqual('Lego')
      // Check GET /products/:id
      await request
        .get('/products/2')
        .set({'Authorization': `Bearer ${token}`})
        .expect(404);
    });

    it('should return 401 if it is an user token', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .delete('/products/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ id: 1 });
      // Assert
      expect(result.status).toBe(401);
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
        .delete('/products/')
        .send({ id: 2 });
      // Assert
      expect(result.status).toBe(401);
    });
  });
})
