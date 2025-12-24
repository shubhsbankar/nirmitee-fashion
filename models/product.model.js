import mongoose, { Document, Model, Schema } from "mongoose";


/**
 * Schema definition
 */
const productSchema = new Schema(
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
const ProductModel = (mongoose.models && (mongoose.models ).Product)
  ? (mongoose.models ).Product
  : mongoose.model("Product", productSchema, "products");

export default ProductModel;

