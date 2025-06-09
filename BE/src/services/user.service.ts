import User from '../models/user.model';

import jwt from 'jsonwebtoken';

export const signupUser = async (data: SignupData) => {
  const { firstName, lastName, username, email, password } = data;

  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    throw new Error('USERNAME_EXISTS');
  }

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw new Error('EMAIL_EXISTS');
  }

  const newUser = new User({ firstName, lastName, username, email, password });
  await newUser.save();

  const token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY!, {
    expiresIn: '3d',
  });

  return { userId: newUser.id, token };
};

export const loginUser = async (data: LoginData) => {
  const { username, password } = data;

  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isValidPassword = await existingUser.matchPassword(password);
  if (!isValidPassword) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET_KEY!, {
    expiresIn: '3d',
  });

  return { userId: existingUser.id, token };
};

export const getUserIdByUsername = async (userName: string) => {
  const existingUser = await User.findOne({ username: userName.toLowerCase() });
  if (!existingUser) {
    throw new Error('USER_NOT_FOUND');
  }
  return existingUser.id;
};