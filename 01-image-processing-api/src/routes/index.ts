import express from 'express';
import images from './api/images';

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('main api routes');
});

routes.use('/images', images.images);

export default routes;
