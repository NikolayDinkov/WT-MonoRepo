import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const checkAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY); //will throw error will the token is invalid
    req.userId = decoded.id; // passes the id to the next middleware
    next();
  } catch (err) {
    res.status(403).json({ message: 'Authentication failed!' });
  }
};
