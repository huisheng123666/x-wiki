import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import {genErrRes, getToken, verifyToken} from "@/util";
import CommentModel from '@/model/comment'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<{ count: number }>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const token = getToken(req)
  const { liked, id } = req.body
  try {
    const deUser = await verifyToken(token)
    const comment = await CommentModel.findOne({ _id: req.body.id })
    if (!comment) {
      res.status(200).json({ code: 0, message: '评论已删除' })
      return
    }
    const users: any = {
      ...comment.likedUser
    }
    if (liked) {
      users[deUser._id!] = liked
    } else {
      delete users[deUser._id!]
    }
    const likeNum = liked ? comment.like + 1 : comment.like === 0 ? 0 : comment.like - 1
    await CommentModel.updateOne({ _id: req.body.id }, { like: likeNum, likedUser: users })
    res.status(200).json({ code: 1, data: { count: likeNum } })
  } catch (err: any) {
    res.status(200).json(genErrRes(err.message, res))
  }
}
