import { Schema, model, models } from 'mongoose'

const categorySchema = new Schema<Category>({
  label: { type: String, required: true },
  value: { type: String, required: true },
})

export default models.categories || model<Category>('categories', categorySchema)