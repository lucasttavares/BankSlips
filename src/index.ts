import express from 'express';
import adminRouter from './routes/AdminRoutes';
import bankSlipsRouter from './routes/BankSlipsRoutes';
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.json';

const app = express();
app.use(express.json());
app.use('/admin', adminRouter);
app.use('/rest', bankSlipsRouter);
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export { app };
