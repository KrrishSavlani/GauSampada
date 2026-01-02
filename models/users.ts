import mongoose from "mongoose"

// Define a proper interface for the User document
export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: string;
}

// Rename schema variable to UserSchema and keep fields
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
}, { timestamps: true })

// Export model in a way that avoids OverwriteModelError when HMR/reload occurs
const UserModel = (mongoose.models && (mongoose.models as any).User)
  ? (mongoose.models as any).User as mongoose.Model<IUser>
  : mongoose.model<IUser>("User", UserSchema);

export default UserModel
