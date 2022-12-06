import { Schema, model, models } from 'mongoose'

const categorySchema = new Schema<Category>({
  label: { type: String, required: true },
  value: { type: Number, required: true },
})

export default models.categories || model<Category>('categories', categorySchema)
