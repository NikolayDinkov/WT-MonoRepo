import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed!');
    }
    jwt.verify(token, process.env.SECRET_KEY); //will throw error will the token is invalid
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Authentication failed!' });
  }
};
