import User from '../models/user.model';

const jwt = require('jsonwebtoken');

interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

export const signupUser = async (data: SignupData) => {
  const { firstName, lastName, username, email, password } = data;

  const existingUserByUsername = await User.findOne({ username });
  if (existingUserByUsername) {
    throw { status: 409, message: 'User with this username already exists' };
  }

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw { status: 409, message: 'User with this email already exists' };
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
    throw { status: 401, message: 'Invalid username or password' };
  }

  const isValidPassword = await existingUser.matchPassword(password);
  if (!isValidPassword) {
    throw { status: 401, message: 'Invalid username or password' };
  }

  const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET_KEY!, {
    expiresIn: '3d',
  });

  return { userId: existingUser.id, token };
};
