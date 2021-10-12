import express from 'express';
import productRoutes from './handlers/product';
import userRoutes from './handlers/user';
import orderRoutes from './handlers/order';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(express.json());

app.get('/', function (req: express.Request, res: express.Response) {
  res.send('Hello World!');
});

productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
