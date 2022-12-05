import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import userModel from "@/model/user";
import jwt from 'jsonwebtoken'
import { setCookie } from "@/util/cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const { username } = req.body
  let user = await userModel.findOne({ username })
  if (user) {
    res.status(200).json({
      code: 0,
      message: '用户名已存在'
    })
    return
  }
  const newUser = await userModel.create(req.body)
  const token = jwt.sign({
    _id: newUser._id,
    username: newUser.username,
    avatar: newUser.avatar
  }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  })
  setCookie(res, 'token', encodeURIComponent(token), { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true })
  res.status(200).json({ code: 1 })
}
