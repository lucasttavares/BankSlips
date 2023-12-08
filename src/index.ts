import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.json';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

require('./routes/bankslips.routes')(app);

app.listen(process.env.PORT, () => {
  console.log(`Server rodando na porta ${process.env.PORT}`);
});
