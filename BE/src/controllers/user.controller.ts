import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { loginUser, signupUser } from '../services/user.service';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ errors: errors.array() });
    return;
  }

  try {
    const result = await signupUser(req.body);
    res
      .status(201)
      .json(result);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object
        .values(error.errors)
        .map((e: any) => e.message);
      res
        .status(400)
        .json({ errors: messages.map((msg) => ({ msg })), });
      return;
    }

    switch (error.message) {
      case 'USERNAME_EXISTS':
        res
          .status(409)
          .json({ message: 'User with this username already exists' });
        break;
      case 'EMAIL_EXISTS':
        res
          .status(409)
          .json({ message: 'User with this email already exists' });
        break;
      default:
        res
          .status(500)
          .json({ message: 'Server error while registering' });
        break;
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res
      .status(400)
      .json({ errors: errors.array() });
    return;
  }

  try {
    const result = await loginUser(req.body);
    res
      .status(200)
      .json(result);
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      res
        .status(401)
        .json({ message: 'Invalid username or password' });
    } else {
      res
        .status(500)
        .json({ message: 'Server error while logging in' });
    }
  }
};

export default { signup, login };
