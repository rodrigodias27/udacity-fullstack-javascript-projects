import express from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyAuthTokenRoleAdmin, verifyAuthTokenRoleAdminUserId } from '../auth';

dotenv.config();

const { TOKEN_SECRET } = process.env;

const store = new UserStore();

const index = async (_req: express.Request, res: express.Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const show = async (req: express.Request, res: express.Response) => {
  try {
    const user = await store.show(req.params.id);

    if (user == undefined) {
      res.status(404).send(`Could not find user ${req.params.id}`);
      return;
    }

    res.json(user);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const create = async (req: express.Request, res: express.Response) => {
  try {
    const user: User = {
      id: 1,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password_digest: '',
      role: req.body.role,
    };

    const role = req.body.role as unknown as string
    if (role != 'user' && role != 'admin') {
      res.status(400).json('Role must be admin or user');
      return
    }

    const newUser = await store.create(user, req.body.password);

    res.json(newUser);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: express.Request, res: express.Response) => {
  try {
    const first_name = req.body.first_name as unknown as string;
    const last_name = req.body.last_name as unknown as string;
    const password = req.body.password as unknown as string;

    const user = await store.authenticate(first_name, last_name, password);

    if (user == null) {
      res.status(401).json('Could not authenticate');
      return;
    }

    const token_secret = TOKEN_SECRET as unknown as string;
    var token = jwt.sign({ 'user': user }, token_secret);
    res.json(token);
  } catch (err) {
    console.error(err);

    res.status(401);
    res.json({ err });
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    const user: User = {
      id: req.body.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password_digest: '',
      role: '',
    };

    const updatedUser = await store.update(user, req.body.password);

    res.json(updatedUser);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: express.Request, res: express.Response) => {
  try {
    const user = await store.delete(req.body.id);
    res.json(user);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users/', verifyAuthTokenRoleAdmin, index);
  app.get('/users/:id', verifyAuthTokenRoleAdmin, show);
  app.post('/users/', verifyAuthTokenRoleAdmin, create);
  app.post('/users/authenticate/', authenticate);
  app.put('/users/', verifyAuthTokenRoleAdminUserId, update);
  app.delete('/users/', verifyAuthTokenRoleAdminUserId, destroy);
};

export default userRoutes;
