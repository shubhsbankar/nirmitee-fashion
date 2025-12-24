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
 * Schema definition
 */
const userSchema = new Schema(
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
userSchema.pre("save", async function (next) {
  // if password not modified, skip hashing
  if (!this.isModified("password")) return next;

  // `this.password` could be undefined from types; cast to string for hash
  const plain = this.password ;
  const hashed = await bcrypt.hash(plain, 10);
  this.password = hashed;
  return next;
});

/**
 * Instance method to compare password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  // this.password may be undefined if the doc was queried without +password
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Prevent OverwriteModelError in environments with hot-reload (Next.js dev)
 * Export a Model<IUser> default.
 */
const UserModel = (mongoose.models && (mongoose.models ).User)
  ? (mongoose.models ).User
  : mongoose.model("User", userSchema, "users");

export default UserModel;

