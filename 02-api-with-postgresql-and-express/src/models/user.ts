import Client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS, TOKEN_SECRET } = process.env;

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  password_digest: string;
  role: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(user: User, password: string): Promise<User> {
    try {
      const sql = 'INSERT INTO users (first_name, last_name, password_digest, role) VALUES($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();

      const pepper = BCRYPT_PASSWORD as unknown as string;
      const salt = SALT_ROUNDS as unknown as string;

      const hash: string = bcrypt.hashSync(password + pepper, parseInt(salt));

      const result = await conn.query(sql, [user.first_name, user.last_name, hash, user.role]);

      const user_response = result.rows[0];

      conn.release();

      return user_response;
    } catch (err) {
      throw new Error(`Could not add new user ${user.first_name} ${user.last_name}. Error: ${err}`);
    }
  }

  async update(user: User, password: string): Promise<User> {
    try {
      const sql = 'UPDATE users SET first_name=($1), last_name=($2), password_digest=($3) WHERE id=($4) RETURNING *';
      const conn = await Client.connect();

      const pepper = BCRYPT_PASSWORD as unknown as string;
      const salt = SALT_ROUNDS as unknown as string;

      const hash: string = bcrypt.hashSync(password + pepper, parseInt(salt));

      const result = await conn.query(sql, [user.first_name, user.last_name, hash, user.id]);

      const user_response = result.rows[0];

      conn.release();

      return user_response;
    } catch (err) {
      throw new Error(`Could not update user ${user.first_name} ${user.last_name}. Error: ${err}`);
    }
  }

  async authenticate(first_name: string, last_name: string, password: string): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM users WHERE first_name=($1) and last_name=($2)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [first_name, last_name]);

      if (result.rows.length) {
        const user = result.rows[0];

        conn.release();

        const pepper = BCRYPT_PASSWORD as unknown as string;
        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          return user
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Could not authenticate user ${first_name} ${last_name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';

      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
