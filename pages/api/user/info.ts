import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import jwt from "jsonwebtoken";
import {genErrRes, getToken, verifyToken} from "@/util";
import userModel from "@/model/user";
import {setCookie} from "@/util/cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<Partial<User>>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const token = getToken(req)
  try {
    const deUser = await verifyToken(token)
    const user = await userModel.findOne({ _id: deUser._id }, { __v: 0, password: 0 })
    res.status(200).json({ code: 1, data: user })
  } catch (e: any) {
    setCookie(res, 'token', '', { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true })
    res.status(200).json(genErrRes(e.message) )
  }
}
