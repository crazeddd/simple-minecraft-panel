import mongoose from "mongoose";

export interface UserSchema extends mongoose.Schema {
  username: string;
  password: string;
}

const UserSchema = new mongoose.Schema<UserSchema>({
  username: {
    type: String,
    required: [true, "please provide a username"],
    unique: [true, "username already exists"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    unique: false,
  },
});

export default mongoose.models.Users || mongoose.model("Users", UserSchema);