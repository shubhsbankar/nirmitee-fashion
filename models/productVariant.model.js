import mongoose, { Document, Model, Schema } from "mongoose";


/**
 * Schema definition
 */
const productvariantSchema = new Schema(
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
const ProductVariantModel = (mongoose.models && (mongoose.models ).ProductVariant)
  ? (mongoose.models ).ProductVariant
  : mongoose.model("ProductVariant", productvariantSchema, "productvariants");

export default ProductVariantModel;

