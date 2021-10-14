import supertest from 'supertest';
import app from '../../server';
import client from '../../database';
import { OrderStore } from '../../models/order';
import { ProductStore } from '../../models/product';
import { UserStore } from '../../models/user';

const request = supertest(app);

const store = new OrderStore()
const product_store = new ProductStore()
const user_store = new UserStore()

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

describe('Order endpoints', () => {

  beforeEach(async () => {
    // Setup: create an user to auth and a product to add to order
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
    await product_store.create({
      id: 1,
      name: 'Lego StarWars',
      price: 5000,
      category: 'Lego'
    });
    await product_store.create({
      id: 2,
      name: 'Lego Mario',
      price: 50000,
      category: 'Lego'
    });
    await store.create(1);
    await store.add_product(1, 1, 12);
  });

  afterEach(async () => {
    // Clean table users, orders, products and orders_products
    const conn = await client.connect();
    const sql = 'TRUNCATE TABLE orders_products cascade;' +
      'ALTER SEQUENCE orders_products_id_seq RESTART WITH 1;'+
      'TRUNCATE TABLE orders cascade;' +
      'ALTER SEQUENCE orders_id_seq RESTART WITH 1;'+
      'TRUNCATE TABLE products cascade;' +
      'ALTER SEQUENCE products_id_seq RESTART WITH 1;' +
      'TRUNCATE TABLE users cascade;' +
      'ALTER SEQUENCE users_id_seq RESTART WITH 1;';;
    await conn.query(sql);
    conn.release();
  });

  describe('POST /orders/', () => {
    it('should add a order', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .post('/orders/')
        .set({'Authorization': `Bearer ${token}`})
        .send({user_id: 1});
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual({
        id: 2,
        products: [ null ],
        quantities: [ null ],
        user_id: 1,
        status: 'active',
      });
    });

    it('should return 401 if it is an user token', async () => {
      const token = await authUser();
      const result = await request
        .post('/orders/')
        .set({'Authorization': `Bearer ${token}`})
        .send({user_id: 1});
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
        .post('/orders/')
        .send({user_id: 1});
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('GET /orders/', () => {
    it('should return a list of orders', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .get('/orders/')
        .set({'Authorization': `Bearer ${token}`})
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody.length).toEqual(1)
      expect(resBody).toEqual([{
        id: 1,
        products: [ 1 ],
        quantities: [ 12 ],
        user_id: 1,
        status: 'active',
      }]);
    });

    it('should return 401 if it is an user token', async () => {
      const token = await authUser();
      const result = await request
        .get('/orders/')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request.get('/orders/')
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('GET /orders/:id', () => {
    it('should return the correct order', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .get('/orders/1')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual({
        id: 1,
        products: [ 1 ],
        quantities: [ 12 ],
        user_id: 1,
        status: 'active',
      });
    });

    it('should return 404 if order_id doesn\'t exists', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .get('/orders/999')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(404)
    });

    it('should return 401 if it is an user token', async () => {
      const token = await authUser();
      const result = await request
        .get('/orders/1')
        .set({'Authorization': `Bearer ${token}`});
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request.get('/orders/1')
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('GET /orders-active/', () => {
    it('should return the correct orders', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .get('/orders-active/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ user_id: 1 });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual([{
        id: 1,
        products: [ 1 ],
        quantities: [ 12 ],
        user_id: 1,
        status: 'active',
      }]);
    });

    it('should return 401 if token is different from user_id in body', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .get('/orders-active/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ user_id: 1 });
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return active orders if token is from same user in body', async () => {
      // Arrange
      await store.create(2);
      // Act
      const token = await authUser();
      const result = await request
        .get('/orders-active/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ user_id: 2 });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual([{
        id: 2,
        products: [ null ],
        quantities: [ null ],
        user_id: 2,
        status: 'active'
      }]);
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request.get('/orders-active/')
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('GET /orders-complete/', () => {
    it('should return the correct orders', async () => {
      // Assert
      await store.update(1, 1, 'complete')
      // Act
      const token = await authAdmin();
      const result = await request
        .get('/orders-complete/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ user_id: 1 });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual([{
        id: 1,
        products: [ 1 ],
        quantities: [ 12 ],
        user_id: 1,
        status: 'complete',
      }]);
    });

    it('should return 401 if token is different from user_id in body', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .get('/orders-complete/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ user_id: 1 });
      // Assert
      expect(result.status).toBe(401)
    });

    it('should return active orders if token is from same user in body', async () => {
      // Arrange
      await store.create(2);
      await store.update(2, 2, 'complete');
      // Act
      const token = await authUser();
      const result = await request
        .get('/orders-complete/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ user_id: 2 });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual([{
        id: 2,
        products: [ null ],
        quantities: [ null ],
        user_id: 2,
        status: 'complete'
      }]);
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request.get('/orders-complete/')
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('POST /orders-products/', () => {
  });

  describe('PUT /orders-products/', () => {
  });

  describe('PUT /orders/', () => {
    it('should update an order', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .put('/orders/')
        .set({'Authorization': `Bearer ${token}`})
        .send({id: 1, user_id: 1, status: 'complete'});
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual({
        id: 1,
        products: [ 1 ],
        quantities: [ 12 ],
        user_id: 1,
        status: 'complete',
      });
    });

    it('should return 401 if token is different from user in order', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .put('/orders/')
        .set({'Authorization': `Bearer ${token}`})
        .send({id: 1, user_id: 1, status: 'complete'});
      // Assert
      expect(result.status).toBe(401)
    });

    it('should update the order if token is from same user in order', async () => {
      // Arrange
      await store.create(2);
      // Act
      const token = await authUser();
      const result = await request
        .put('/orders/')
        .set({'Authorization': `Bearer ${token}`})
        .send({id: 2, user_id: 2, status: 'complete'});
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual({
        id: 2,
        products: [ null ],
        quantities: [ null ],
        user_id: 2,
        status: 'complete',
      });
    });

    it('should return 400 if status is differente from "active" and "complete"', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .put('/orders/')
        .set({'Authorization': `Bearer ${token}`})
        .send({id: 1, status: 'processing'});
      // Assert
      expect(result.status).toBe(400)
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
      .put('/orders/')
      .send({id: 1, status: 'complete'});
      // Assert
      expect(result.status).toBe(401)
    });
  });

  describe('DELETE /orders/', () => {
    it('should remove the order', async () => {
      // Act
      const token = await authAdmin();
      const result = await request
        .delete('/orders/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ id: 1 });
      // Assert
      expect(result.status).toBe(200)
      const resBody = result.body
      expect(resBody).toEqual({
        id: 1,
        products: [ 1 ],
        quantities: [ 12 ],
        user_id: 1,
        status: 'active',
      });
      // Check GET /orders/:id
      await request
        .get('/orders/1')
        .set({'Authorization': `Bearer ${token}`})
        .expect(404);
    });

    it('should return 401 if it is an user token', async () => {
      // Act
      const token = await authUser();
      const result = await request
        .delete('/orders/')
        .set({'Authorization': `Bearer ${token}`})
        .send({ id: 1 });
      // Assert
      expect(result.status).toBe(401);
    });

    it('should return 401 if there is no token', async () => {
      // Act
      const result = await request
        .delete('/orders/')
        .send({ id: 1 });
      // Assert
      expect(result.status).toBe(401);
    });
  });
});
