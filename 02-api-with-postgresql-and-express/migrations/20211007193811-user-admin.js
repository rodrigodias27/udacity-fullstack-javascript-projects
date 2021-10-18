'use strict';

var dbm;
var type;
var seed;
var dotenv = require('dotenv');
var bcrypt = require('bcrypt');
var pg = require('pg');

dotenv.config()

const {
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
  ADMIN_PASSWORD,
  BCRYPT_PASSWORD,
  SALT_ROUNDS,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV,
} = process.env

let client;

if (ENV === 'dev') {
  client = new pg.Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

if (ENV === 'test') {
  client = new pg.Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  const sql = 'INSERT INTO users (first_name, last_name, password_digest, role) VALUES($1, $2, $3, $4) RETURNING first_name, last_name, role'
  const conn = await client.connect();

  const hash = bcrypt.hashSync(
    ADMIN_PASSWORD + BCRYPT_PASSWORD,
    parseInt(SALT_ROUNDS)
  );

  const result = await conn
      .query(sql, [ADMIN_FIRST_NAME, ADMIN_LAST_NAME, hash, 'admin'])

  const user_response = result.rows[0]
  console.log(user_response)

  conn.release()
  return user_response
};

exports.down = async function(db) {
  const sql = 'DELETE FROM users WHERE first_name=$1 and last_name=$2 RETURNING *'
  const conn = await client.connect();

  const result = await conn
      .query(sql, [ADMIN_FIRST_NAME, ADMIN_LAST_NAME])

  const user_response = result.rows[0]
  console.log(user_response)

  conn.release()
  return user_response;
};

exports._meta = {
  "version": 1
};
