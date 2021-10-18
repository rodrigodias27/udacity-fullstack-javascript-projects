# Storefront Backend Project
## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo.

- [Storefront Backend Project](#storefront-backend-project)
  - [Getting Started](#getting-started)
  - [Starting server:](#starting-server)
    - [Preparing](#preparing)
    - [Running server](#running-server)
    - [Testing](#testing)
  - [License](#license)

## Starting server:

### Preparing

- Install requirements
```bash
npm install
```
- Create a file named .env and write this variables there:
```txt
# Environment
ENV=dev
# DATABASE CREDENTIALS
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_USER=storefront
POSTGRES_PASSWORD=storefront123

POSTGRES_TEST_DB=storefront_test

# BCRYPT CONFIG
BCRYPT_PASSWORD=7Ce7zBf5B6Hv
SALT_ROUNDS=10

# JWT CONFIG
TOKEN_SECRET=t9fnhHSV8qds

# USER ADMIN
ADMIN_FIRST_NAME=rodrigo
ADMIN_LAST_NAME=dias
ADMIN_PASSWORD=dEGtUcbpe4G4
```

- Start database
  - If you are familiar with docker-compose you just need to run command
  ```bash
  docker-compose up
  ```
  Database will be served on http://localhost:5432

  - Or you can create database and user manually
  ```sql
  CREATE USER storefront;
  CREATE DATABASE storefront;
  GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront;
  ```

- Migrations
```
db-migrate up
```

### Running server

```bash
npm run watch
```
Server will be served on http://localhost:3000

### Testing

- Create a test database
```SQL
CREATE DATABASE storefront_test;
GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storefront;
```

- Test command
```
npm run test
```

## License

[License](../LICENSE.txt)
