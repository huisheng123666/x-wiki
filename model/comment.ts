import { Schema, model, models, Types } from 'mongoose'

const CommentSchema = new Schema<Comment>({
  article: { type: String, required: true },
  content: { type: String, required: true },
  user: {
    type: Types.ObjectId,
    ref: 'users'
  },
  parent: { type: String, default: '' },
  relation: {
    type: Types.ObjectId,
    ref: 'users'
  },
  like: { type: Number, default: 0 },
  createTime: { type: Number, default: Date.now() },
  likedUser: { type: Object, default: {} }
})

export default models.comments || model<Comment>('comments', CommentSchema)
