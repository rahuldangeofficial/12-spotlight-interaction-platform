import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Comment', CommentSchema);
