import { Schema, model, models, Types } from 'mongoose'

const articleSchema = new Schema<Article>({
  title: { type: String, required: true },
  cover: { type: String, required: true },
  content: { type: String, required: true },
  user: {
    type: Types.ObjectId,
    ref: 'users'
  }
})

export default models.articles || model<Article>('articles', articleSchema)
