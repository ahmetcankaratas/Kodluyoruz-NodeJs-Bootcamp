import mongoose from 'mongoose';
import IUser from '../interfaces/userInterface';

//Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
  },
  surname: {
    type: String,
    required: true,
    max: 255,
    min: 2,
  },
  userName: {
    type: String,
    required: true,
    max: 255,
    min: 2,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
});

export default mongoose.model<IUser>('User', userSchema);
