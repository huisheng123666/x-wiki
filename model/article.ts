import { Schema, model, models, Types } from 'mongoose'

const articleSchema = new Schema<Article>({
  title: { type: String, required: true },
  cover: { type: String, required: true },
  content: { type: String, required: true },
  user: {
    type: Types.ObjectId,
    ref: 'users'
  },
  category: { type: Number, required: true },
  createTime: { type: Number, default: Date.now() },
  view: { type: Number, default: 0 },
})

export default models.articles || model<Article>('articles', articleSchema)
