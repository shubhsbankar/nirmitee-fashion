import mongoose, { Document, Model, Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique:true,trim: true },
    discountPercentage: { type: Number, required: true, trim: true },
    minShoppingAmount: { type: Number, required: true, trim: true },
    validity: { type: Date, required: true,  },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

// NOTE: check mongoose.models to avoid OverwriteModelError in dev/hot-reload
const CouponModel =
  (mongoose.models && (mongoose.models ).Coupon) ||
  mongoose.model("Coupon", couponSchema,'coupons');

export default CouponModel;