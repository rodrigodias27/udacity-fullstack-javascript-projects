import Client from '../database';

export type Order = {
  id: number;
  products: number[] | null[];
  quantities: number[] | null[];
  user_id: number;
  status: string;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql =
        'select orders.id,' +
        ' array_agg(orders_products.product_id) as products,' +
        ' array_agg(orders_products.quantity) as quantities,' +
        ' orders.user_id, orders.status' +
        ' from orders left join orders_products' +
        ' on orders.id = orders_products.order_id and orders_products.quantity > 0' +
        ' group by orders.id, orders.user_id, orders.status;';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql =
        'select orders.id,' +
        ' array_agg(orders_products.product_id) as products,' +
        ' array_agg(orders_products.quantity) as quantities,' +
        ' orders.user_id, orders.status' +
        ' from orders left join orders_products' +
        ' on orders.id = orders_products.order_id and orders_products.quantity > 0' +
        ' WHERE orders.id=($1)' +
        ' group by orders.id, orders.user_id, orders.status;';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(user_id: number): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [user_id, 'active']);

      const order = result.rows[0];

      conn.release();

      const id = order.id as unknown as string;
      const createdOrder = await this.show(id);

      return createdOrder;
    } catch (err) {
      throw new Error(`Could not add new order for user ${user_id}. Error: ${err}`);
    }
  }

  async update(id: number, user_id: number, status: string): Promise<Order> {
    try {
      const sql = 'UPDATE orders SET status=($1) WHERE id=($2) and user_id=($3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [status, id, user_id]);

      const order = result.rows[0];

      conn.release();

      const order_id = id as unknown as string;
      const updatedOrder = await this.show(order_id);

      return updatedOrder;
    } catch (err) {
      throw new Error(`Could not update order ${id}. Error: ${err}`);
    }
  }

  async add_product(order_id: number, product_id: number, quantity: number): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [order_id, product_id, quantity]);

      conn.release();

      const id = order_id as unknown as string;
      const order = await this.show(id);

      return order;
    } catch (err) {
      throw new Error(`Could not add product ${product_id} to order ${order_id}. Error: ${err}`);
    }
  }

  async update_product(order_id: number, product_id: number, quantity: number): Promise<Order> {
    try {
      const sql = 'UPDATE orders_products SET quantity=($1) WHERE order_id=($2) and product_id=($3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [quantity, order_id, product_id]);

      conn.release();

      const id = order_id as unknown as string;
      const order = await this.show(id);

      return order;
    } catch (err) {
      throw new Error(`Could not edit product ${product_id} on order ${order_id}. Error: ${err}`);
    }
  }

  async get_orders_by_status(user_id: number, status: string): Promise<Order[]> {
    try {
      const sql =
        'select orders.id,' +
        ' array_agg(orders_products.product_id) as products,' +
        ' array_agg(orders_products.quantity) as quantities,' +
        ' orders.user_id, orders.status' +
        ' from orders left join orders_products' +
        ' on orders.id = orders_products.order_id and orders_products.quantity > 0' +
        ' WHERE orders.user_id=($1) and orders.status=($2)' +
        ' group by orders.id, orders.user_id, orders.status;';
      const conn = await Client.connect();

      const result = await conn.query(sql, [user_id, status]);
      const orders = result.rows;

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(`Could not find orders using user_id ${user_id} and status ${status}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const order_deleted = await this.show(id);

      const conn = await Client.connect();

      const sql_products = 'DELETE FROM orders_products WHERE order_id=($1) RETURNING *';
      const result_products = await conn.query(sql_products, [id]);
      const products = result_products.rows[0];

      const sql_orders = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const result_order = await conn.query(sql_orders, [id]);

      const order = result_order.rows[0];

      conn.release();

      return order_deleted;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }
}
