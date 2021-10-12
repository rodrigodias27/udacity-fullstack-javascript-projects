import Client from '../database';

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';

      const result = await conn.query(sql);

      const orders = result.rows

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Product | null> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const order = result.rows[0]

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [product.name, product.price, product.category]);

      const newProduct = result.rows[0];

      conn.release();

      return newProduct;
    } catch (err) {
      throw new Error(`Could not add new product ${product.name}. Error: ${err}`);
    }
  }

  async update(product: Product): Promise<Product> {
    try {
      const sql = 'UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [product.name, product.price, product.category, product.id]);

      const updatedProduct = result.rows[0];

      conn.release();

      return updatedProduct;
    } catch (err) {
      throw new Error(`Could not add new product ${product.name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }
}
