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


/**
 * Schema definition
 */
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
    subCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Category'
    }]
  },
  {
    timestamps: true,
  }
);


const CategoryModel = (mongoose.models && (mongoose.models ).Category)
  ? (mongoose.models ).Category
  : mongoose.model("Category", categorySchema, "categories");

export default CategoryModel;

