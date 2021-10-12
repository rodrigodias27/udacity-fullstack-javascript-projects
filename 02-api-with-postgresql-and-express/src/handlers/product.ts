import express from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthTokenRoleAdmin } from '../auth';

const store = new ProductStore();

const index = async (_req: express.Request, res: express.Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const show = async (req: express.Request, res: express.Response) => {
  try {
    const product = await store.show(req.params.id);

    if (product == undefined) {
      res.status(404).send(`Could not find product ${req.params.id}`);
      return;
    }

    res.json(product);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const create = async (req: express.Request, res: express.Response) => {
  try {
    const product: Product = {
      id: 1,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    const newProduct = await store.create(product);

    res.json(newProduct);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const update = async (req: express.Request, res: express.Response) => {
  try {
    const product: Product = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    const updatedProduct = await store.update(product);

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: express.Request, res: express.Response) => {
  try {
    const product = await store.delete(req.body.id);
    res.json(product);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.json(err);
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products/', index);
  app.get('/products/:id', show);
  app.post('/products/', verifyAuthTokenRoleAdmin, create);
  app.put('/products/', verifyAuthTokenRoleAdmin, update);
  app.delete('/products/', verifyAuthTokenRoleAdmin, destroy);
};

export default productRoutes;
