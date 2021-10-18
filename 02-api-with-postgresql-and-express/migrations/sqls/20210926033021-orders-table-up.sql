CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  status VARCHAR(255) NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS orders_products (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  UNIQUE (order_id, product_id),
  CONSTRAINT fk_order_id FOREIGN KEY(order_id) REFERENCES orders(id),
  CONSTRAINT fk_product_id FOREIGN KEY(product_id) REFERENCES products(id)
);
