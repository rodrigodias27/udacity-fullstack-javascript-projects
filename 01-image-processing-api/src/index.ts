import express from 'express';
import routes from './routes/index'

const app = express();
const port = 3000;


const errorMiddleware = (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
  console.error(err.message);
  console.error(err.stack);
  res.status(500).send('Something broke!');
};


app.use('/api', routes);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
