import express from 'express';
import 'dotenv/config';

const app = express();
app.use(express.json());

require('./routes/bankslips.routes')(app);

app.listen(process.env.PORT, () => {
  console.log(`Server rodando na porta ${process.env.PORT}`);
});
