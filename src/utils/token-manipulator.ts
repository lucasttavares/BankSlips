import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateToken = (id: number) => {
  return jwt.sign({ id }, `${process.env.TOKEN_KEY}`, { expiresIn: 1800 });
};

export const validateToken = (token: string) => {
  let validate = true;
  jwt.verify(token, `${process.env.TOKEN_KEY}`, error => {
    if (error) {
      validate = false;
    }
  });
  return validate;
};
