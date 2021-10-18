CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password_digest VARCHAR(255),
  role VARCHAR(255) NOT NULL,
  UNIQUE (first_name, last_name)
);
