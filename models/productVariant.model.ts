import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

/**
 * Iproductvariant - TypeScript interface for a productvariant document
 */
export interface Iproductvariant extends Document {
 _id?: Types.ObjectId;

  color: string;
  sku: string;
  size: string;
  stock: number,

  product: Types.ObjectId; // ref: Category

  mrp: number;
  sellingPrice: number;
  discountPercentage: number;

  media: Types.ObjectId[]; // ref: Media


  deletedAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Schema definition
 */
const productvariantSchema = new Schema<Iproductvariant>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
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
    sku: {
      type: String,
      required: true,
      unique: true
    },
    stock:{
      type: Number,
      required: true
    },
    media: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Media',
       required: true
    }],
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
 * Prevent OverwriteModelError in environments with hot-reload (Next.js dev)
 * Export a Model<Iproductvariant> default.
 */
const ProductVariantModel: Model<Iproductvariant> = (mongoose.models && (mongoose.models as any).ProductVariant)
  ? (mongoose.models as any).ProductVariant
  : mongoose.model<Iproductvariant>("ProductVariant", productvariantSchema, "productvariants");

export default ProductVariantModel;

