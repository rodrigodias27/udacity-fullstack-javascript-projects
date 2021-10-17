import client from '../../database';
import { OrderStore } from '../../models/order';
import { ProductStore } from '../../models/product';
import { UserStore } from '../../models/user';

const store = new OrderStore()
const product_store = new ProductStore()
const user_store = new UserStore()

describe("Order Model", () => {

  beforeEach(async () => {
    // Setup: create an user, order and product
    await user_store.create({
      id: 1,
      first_name: 'Doctor',
      last_name: 'Who',
      password_digest: '',
      role: 'admin',
    },
    'Trenzalore');
    await product_store.create({
      id: 1,
      name: 'Lego StarWars',
      price: 5000,
      category: 'Lego'
    });
    await store.create(1);
    await store.add_product(1, 1, 1, 12);
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

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have an add_product method', () => {
    expect(store.add_product).toBeDefined();
  });

  it('should have an update_product method', () => {
    expect(store.update_product).toBeDefined();
  });

  it('should have a get_order_by_status method', () => {
    expect(store.get_orders_by_status).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a order', async () => {
    // Act
    const result = await store.create(1);
    // Assert
    expect(result).toEqual({
      id: 2,
      products: [ null ],
      quantities: [ null ],
      user_id: 1,
      status: 'active'
    })
  });

  it('index method should return a list of orders', async () => {
    // Act
    const result = await store.index();
    // Assert
    expect(result).toEqual([{
      id: 1,
      products: [ 1 ],
      quantities: [ 12 ],
      user_id: 1,
      status: 'active',
    }]);
  });

  it('show method should return the correct order', async () => {
    // Act
    const result = await store.show("1");
    // Assert
    expect(result).toEqual({
      id: 1,
      products: [ 1 ],
      quantities: [ 12 ],
      user_id: 1,
      status: 'active',
    });
  });

  it('update method should update a order', async () => {
    // Act
    const result = await store.update(1, 1, 'complete');
    // Assert
    expect(result).toEqual({
      id: 1,
      products: [ 1 ],
      quantities: [ 12 ],
      user_id: 1,
      status: 'complete',
    });
  });

  it('add_product method should add an product to order', async () => {
    // Arrange
    const resultCreate = await store.create(1);
    expect(resultCreate).toEqual({
      id: 2,
      products: [ null ],
      quantities: [ null ],
      user_id: 1,
      status: 'active'
    })
    // Act
    const result = await store.add_product(2, 1, 1, 5)
    // Assert
    expect(result).toEqual(
      {
        id: 2,
        products: [ 1 ],
        quantities: [ 5 ],
        user_id: 1,
        status: 'active'
      }
    )
  });

  it('add_product method shouldnt add duplicate product to order', async () => {
    // Act and Assert
    expectAsync(store.add_product(1, 1, 1, 5)).toBeRejected()
  });

  it('update_product_quantity method should edit an product on order', async () => {
    // Act
    const result = await store.update_product(1, 1, 1, 3)
    // Assert
    expect(result).toEqual(
      {
        id: 1,
        products: [ 1 ],
        quantities: [ 3 ],
        user_id: 1,
        status: 'active'
      }
    )
  });

  it('get_order_by_status should return orders with status active', async () => {
    // Act
    const result = await store.get_orders_by_status(1, 'active');
    // Assert
    expect(result).toEqual([{
      id: 1,
      products: [ 1 ],
      quantities: [ 12 ],
      user_id: 1,
      status: 'active',
    }]);
  });

  it('get_order_by_status should return orders with status complete', async () => {
    // Arrange
    const resultUpdated = await store.update(1, 1,'complete');
    expect(resultUpdated).toEqual({
      id: 1,
      products: [ 1 ],
      quantities: [ 12 ],
      user_id: 1,
      status: 'complete',
    });
    // Act
    const result = await store.get_orders_by_status(1, 'complete');
    // Assert
    expect(result).toEqual([{
      id: 1,
      products: [ 1 ],
      quantities: [ 12 ],
      user_id: 1,
      status: 'complete',
    }]);
  });

  it('delete method should remove the order', async () => {
    // Act
    await store.delete('1');
    const result = await store.show('1')
    // Assert
    expect(result).toBeUndefined();
  });
})
