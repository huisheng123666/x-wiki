import { Schema, model, models } from 'mongoose'

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '/imgs/avatar.jpeg' },
  nickname: { type: String, default: '' }
})

export default models.users || model<User>('users', userSchema)
