import client from '../../database';
import { ProductStore } from '../../models/product';

const store = new ProductStore()

describe("Product Model", () => {

  beforeEach(async () => {
    // Setup: create a product
    await store.create({
      id: 1,
      name: 'Lego StarWars',
      price: 5000,
      category: 'Lego'
    });
  });

  afterEach(async () => {
    // Clean table products
    const conn = await client.connect();
    const sql = 'TRUNCATE TABLE products cascade;' +
      'ALTER SEQUENCE products_id_seq RESTART WITH 1;';
    const result = await conn.query(sql);
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

  it('should have a update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a product', async () => {
    // Act
    const result = await store.create({
      id: 2,
      name: 'Lego StarWars Delux',
      price: 2000,
      category: 'Lego/Bricks'
    });
    // Assert
    expect(result).toEqual({
      id: 2,
      name: 'Lego StarWars Delux',
      price: 2000,
      category: 'Lego/Bricks'
    })
  });

  it('create method should throw an error if name already exists', async () => {
    // Act and Assert
    expectAsync(store.create({
      id: 1,
      name: 'Lego StarWars',
      price: 5000,
      category: 'Lego',
    })).toBeRejected()
  });

  it('index method should return a list of products', async () => {
    // Act
    const result = await store.index();
    // Assert
    expect(result).toEqual([{
      id: 1,
      name: 'Lego StarWars',
      price: 5000,
      category: 'Lego'
    }]);
  });

  it('show method should return the correct product', async () => {
    // Act
    const result = await store.show("1");
    // Assert
    expect(result).toEqual({
      id: 1,
      name: 'Lego StarWars',
      price: 5000,
      category: 'Lego'
    });
  });

  it('update method should update a product', async () => {
    // Act
    const result = await store.update({
      id: 1,
      name: 'Lego StarWars Delux',
      price: 5500,
      category: 'Legos'
    });
    // Assert
    expect(result).toEqual({
      id: 1,
      name: 'Lego StarWars Delux',
      price: 5500,
      category: 'Legos'
    });
  });

  it('delete method should remove the product', async () => {
    // Act
    await store.delete('1');
    const result = await store.show('1')
    // Assert
    expect(result).toBeUndefined();
  });
})
