import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountPercentage: number;
  minShoppingAmount: number;
  validity: Date;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const couponSchema = new Schema<ICoupon>(
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
const CouponModel: Model<ICoupon> =
  (mongoose.models && (mongoose.models as any).Coupon) ||
  mongoose.model<ICoupon>("Coupon", couponSchema,'coupons');

export default CouponModel;