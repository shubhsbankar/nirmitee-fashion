import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

/**
 * Iproduct - TypeScript interface for a product document
 */
export interface Iproduct extends Document {
 _id?: Types.ObjectId;

  name: string;
  slug: string;

  category: Types.ObjectId; // ref: Category

  mrp: number;
  sellingPrice: number;
  discountPercentage: number;

  media: Types.ObjectId[]; // ref: Media

  description?: string;

  deletedAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Schema definition
 */
const productSchema = new Schema<Iproduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    media: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Media',
       required: true
    }],
    description: {
      type: String,
       required: true
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

productSchema.index({ category :1});

/**
 * Prevent OverwriteModelError in environments with hot-reload (Next.js dev)
 * Export a Model<Iproduct> default.
 */
const ProductModel: Model<Iproduct> = (mongoose.models && (mongoose.models as any).Product)
  ? (mongoose.models as any).Product
  : mongoose.model<Iproduct>("Product", productSchema, "products");

export default ProductModel;

