import mongoose, { Schema, Types } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  password: { type: String, select: false },
  board: { type: Schema.Types.ObjectId, ref: 'board' }
});

export interface IUser extends Document {
  _id: Types.ObjectId
  name: string;
  email: string;
  password: string;
  board?: Types.ObjectId;
}

const User = mongoose.model<IUser>("user", UserSchema);

export default User;
