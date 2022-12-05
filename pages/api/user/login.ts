import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import userModel from "@/model/user";
import jwt from "jsonwebtoken";
import {setCookie} from "@/util/cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<Partial<User>>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const user = await userModel.findOne(req.body, { __v: 0, password: 0 })
  if (!user) {
    res.status(200).json({ code: 0, message: '用户名或密码错误' })
  }
  const token = jwt.sign({
    _id: user._id,
    username: user.username,
    avatar: user.avatar
  }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  })
  setCookie(res, 'token', encodeURIComponent(token), { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true })
  res.status(200).json({ code: 1, data: user })
}
