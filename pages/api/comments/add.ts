import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import {genErrRes, getToken, verifyToken} from "@/util";
import CommentModel from '@/model/comment'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<Comment>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const token = getToken(req)
  try {
    const deUser = await verifyToken(token)
    const comment = await CommentModel.create({ ...req.body, user: deUser._id, createTime: Date.now() })
    res.status(200).json({ code: 1, data: comment })
  } catch (err: any) {
    res.status(200).json(genErrRes(err.message, res))
  }
}
