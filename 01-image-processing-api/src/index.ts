import express from 'express';

const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
    res.send('Hello world')
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
