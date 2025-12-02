/*import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    asset_id: {
        type: String,
        required: true,
        trim: true
    },
    public_id: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail_url: {
        type: String,
        required: true,
        trim: true
    },
    alt: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true
    }

},
{timestamps : true});


const MediaModel =  mongoose.model('media',mediaSchema);

export default MediaModel;
*/
// models/media.model.ts
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMedia extends Document {
  asset_id: string;
  public_id: string;
  path: string;
  thumbnail_url: string;
  secure_url: string;
  alt?: string;
  title?: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    asset_id: { type: String, required: true, trim: true },
    public_id: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    thumbnail_url: { type: String, required: true, trim: true },
    secure_url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
    title: { type: String, trim: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

// NOTE: check mongoose.models to avoid OverwriteModelError in dev/hot-reload
const MediaModel: Model<IMedia> =
  (mongoose.models && (mongoose.models as any).Media) ||
  mongoose.model<IMedia>("Media", mediaSchema);

export default MediaModel;

