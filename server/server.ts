import express, { Request, Response } from 'express';
import connectDB from './config/db';
const app = express();
const port = 3000;

connectDB();
app.get('/', (req: Request, res: Response) => {
  res.send('Hello000 World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
