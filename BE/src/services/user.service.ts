import { Types } from 'mongoose';
import User from '../models/user.model';

export const findUserByEmail = (email: string) => {
  return User.findOne({ email }).lean().exec();
};

export const createUser = (userData: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}) => {
  const user = new User(userData);
  return user.save();
};

export const updateUser = (
  userId: Types.ObjectId,
  userData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    password?: string;
  }
) => {
  return User.findByIdAndUpdate(userId, userData, { new: true }).exec();
};
