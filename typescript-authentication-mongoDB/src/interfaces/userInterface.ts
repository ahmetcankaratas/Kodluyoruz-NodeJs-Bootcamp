import { Document } from 'mongoose';

export default interface IUser extends Document {
  id?: any;
  name: string;
  surname: string;
  userName: string;
  password: string;
}
