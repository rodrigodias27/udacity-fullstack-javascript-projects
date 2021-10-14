import express from 'express';
import { OrderStore } from '../models/order';
import { verifyAuthTokenRoleAdmin, verifyAuthTokenRoleAdminUserId } from '../auth';

const store = new OrderStore();

const index = async (_req: express.Request, res: express.Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const show = async (req: express.Request, res: express.Response) => {
  try {
    const order = await store.show(req.params.id);

    if (order == undefined) {
      res.status(404).send(`Could not find order ${req.params.id}`);
      return;
    }

    res.json(order);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const create = async (req: express.Request, res: express.Response) => {
  try {
    const user_id = req.body.user_id as unknown as number;

    const newOrder = await store.create(user_id);

    res.json(newOrder);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    const id = req.body.id as unknown as number;
    const user_id = req.body.user_id as unknown as number;
    const status = req.body.status as unknown as string;

    if (status != 'active' && status != 'complete') {
      res.status(400).json('Status must be active or complete');
      return
    }

    const newOrder = await store.update(id, user_id, status);

    res.json(newOrder);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const add_product = async (req: express.Request, res: express.Response) => {
  try {
    const order_id = req.body.order_id as unknown as number;
    const product_id = req.body.product_id as unknown as number;
    const quantity = req.body.quantity as unknown as number;

    const order = await store.add_product(order_id, product_id, quantity);

    res.json(order);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const edit_product = async (req: express.Request, res: express.Response) => {
  try {
    const order_id = req.body.order_id as unknown as number;
    const product_id = req.body.product_id as unknown as number;
    const quantity = req.body.quantity as unknown as number;

    const order = await store.update_product(order_id, product_id, quantity);

    res.json(order);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const active_orders = async (req: express.Request, res: express.Response) => {
  try {
    const user_id = req.body.user_id as unknown as number;
    const status: string = 'active';

    const orders = await store.get_orders_by_status(user_id, status);
    res.json(orders);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const complete_orders = async (req: express.Request, res: express.Response) => {
  try {
    const user_id = req.body.user_id as unknown as number;
    const status = 'complete';

    const orders = await store.get_orders_by_status(user_id, status);
    res.json(orders);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: express.Request, res: express.Response) => {
  try {
    const order = await store.delete(req.body.id);
    res.json(order);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders/', verifyAuthTokenRoleAdmin, index);
  app.get('/orders/:id', verifyAuthTokenRoleAdmin, show);
  app.post('/orders/', verifyAuthTokenRoleAdminUserId, create);
  app.get('/orders-active/', verifyAuthTokenRoleAdminUserId, active_orders);
  app.get('/orders-complete/', verifyAuthTokenRoleAdminUserId, complete_orders);
  app.post('/orders-product/', verifyAuthTokenRoleAdminUserId, add_product);
  app.put('/orders/', verifyAuthTokenRoleAdminUserId, update);
  app.put('/orders-product/', verifyAuthTokenRoleAdminUserId, edit_product);
  app.delete('/orders/', verifyAuthTokenRoleAdmin, destroy);
};

export default orderRoutes;
