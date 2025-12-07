import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
  product: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  rating: number;
  title: string;
  review: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, required: true,ref:'Product' },
    user: { type: Schema.Types.ObjectId, required: true,ref:'User' },
    rating: { type: Number, required: true, },
    title: { type: String, required: true,  },
    review: { type: String, required: true,  },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

// NOTE: check mongoose.models to avoid OverwriteModelError in dev/hot-reload
const ReviewModel: Model<IReview> =
  (mongoose.models && (mongoose.models as any).Review) ||
  mongoose.model<IReview>("Review", reviewSchema,'reviews');

export default ReviewModel;