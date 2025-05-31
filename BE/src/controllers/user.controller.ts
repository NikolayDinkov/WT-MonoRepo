import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
const jwt = require('jsonwebtoken');

import User from '../models/user.model';

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, username, email, password } = req.body;

  let existingUserByUsername;
  try {
    existingUserByUsername = await User.findOne({ username: username });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while registering' });
  }

  if (existingUserByUsername) {
    return res
      .status(409)
      .json({ message: 'User with this username already exists' });
  }

  let existingUserByEmail;
  try {
    existingUserByEmail = await User.findOne({ email: email });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while registering' });
  }

  if (existingUserByEmail) {
    return res
      .status(409)
      .json({ message: 'User with this email already exists' });
  }

  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch (error) {
    return res.status(500).json({ message: 'Error registering the user' });
  }

  let token;
  token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY, {
    expiresIn: '3d',
  });

  res.status(201).json({ userId: newUser.id, token: token });
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (error) {
    return res.status(401).json({ message: 'Error logging in the user' });
  }

  if (!existingUser) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  let isValidPassword;

  try {
    isValidPassword = await existingUser?.matchPassword(password);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  let token;
  token = jwt.sign({ userId: existingUser.id }, process.env.SECRET_KEY, {
    expiresIn: '3d',
  });
  res.status(200).json({ userId: existingUser.id, token: token });
};

export default { signup, login };
