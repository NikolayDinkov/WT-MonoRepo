import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
const jwt = require('jsonwebtoken');

import { loginUser, signupUser } from '../services/user.service';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const result = await signupUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Server error while registering' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ message: error.message || 'Server error while logging in' });
  }
};

export default { signup, login };
