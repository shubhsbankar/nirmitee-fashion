import mongoose, { Document, Model, Schema } from "mongoose";


const reviewSchema = new Schema(
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
const ReviewModel =
  (mongoose.models && (mongoose.models ).Review) ||
  mongoose.model("Review", reviewSchema,'reviews');

export default ReviewModel;