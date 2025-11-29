/*import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true,
        enum: ['user','admin'],
        default: 'user'
    },
    fullName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true,
        select: false
    },
    avatar:{
        url:{
            type: String,
            trim: true
        },
        public_id: {
            type: String,
            trim: true
        }
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    phone:{
        type: String,
        trim: true
    },
    address:{
        type: String,
        trim: true
    },
    deletedAt:{
        type: Date,
        default: null,
        index: true
    },
},{
    timestamps: true
});


userSchema.pre('save', async function(next){
  if (!this.isModified('password'))return next();
  this.password = await bcrypt(this.password, 10);
  next();
});


userSchema.methods = {
    comparePassword : async function(password){
        return bcrypt.compare(password, this.password);
    }
};

const UserModel = mongoose.models.User || mongoose.model('User',userSchema);

export default UserModel; 
*/


// models/user.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

/**
 * IUser - TypeScript interface for a User document
 */
export interface IUser extends Document {
  role: "user" | "admin";
  fullName: string;
  email: string;
  password?: string; // note: password is select: false, so may be undefined unless explicitly selected
  avatar?: {
    url?: string;
    public_id?: string;
  };
  isEmailVerified?: boolean;
  phone?: string;
  address?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  // instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Schema definition
 */
const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false, // will not be returned by default; use .select('+password') when needed
    },
    avatar: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to hash password when modified
 */
userSchema.pre<IUser>("save", async function (next) {
  // if password not modified, skip hashing
  if (!this.isModified("password")) return next;

  // `this.password` could be undefined from types; cast to string for hash
  const plain = this.password as string;
  const hashed = await bcrypt.hash(plain, 10);
  this.password = hashed;
  return next;
});

/**
 * Instance method to compare password
 */
userSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string) {
  // this.password may be undefined if the doc was queried without +password
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Prevent OverwriteModelError in environments with hot-reload (Next.js dev)
 * Export a Model<IUser> default.
 */
const UserModel: Model<IUser> = (mongoose.models && (mongoose.models as any).User)
  ? (mongoose.models as any).User
  : mongoose.model<IUser>("User", userSchema, "users");

export default UserModel;

