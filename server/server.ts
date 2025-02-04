import express, { Request, Response } from 'express';
import connectDB from './config/db';
import authRouter from './modules/auth/auth.route';
import errorHandler from './shared/middleware/error';
const app = express();
const port = 3000;

connectDB();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello000 World!');
});
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
