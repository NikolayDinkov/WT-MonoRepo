import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = Number(process.env.SALT_ROUNDS) || 12;

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  matchPassword: (password: string | Buffer) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, 'Username should be at least 5 characters'],
      validate: {
        validator: (v: string) => /^[a-zA-Z0-9]+$/.test(v),
        message: (props) =>
          `${props.value} must contain only Latin letters and digits.`,
      },
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password should be at least 6 characters'],
      validate: {
        validator: (v: string) => /^[a-zA-Z0-9]+$/.test(v),
        message: (props) =>
          `${props.value} must contain only Latin letters and digits.`,
      },
    },
  },
  { timestamps: true }
);

// Password hashing
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

// Compare passwords
userSchema.methods.matchPassword = function (password: string | Buffer) {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
