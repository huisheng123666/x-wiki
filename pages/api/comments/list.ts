import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import CommentModel from "@/model/comment";
import dayjs from "dayjs";
import {genErrRes, getToken, verifyToken} from "@/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<PageList<Comment>>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  try {
    const params: any = {
      ...req.body
    }
    const token = getToken(req)
    let deUser: any
    try {
      deUser = await verifyToken(token)
    } catch (err) {}
    const { page = 1, size = 10 } = req.body
    const query = CommentModel.find(params, { __v: 0 }).sort({ createTime: -1 })
    query.populate('user', { username: 1, nickname: 1, avatar: 1 }).populate('relation', { username: 1, nickname: 1, avatar: 1 })
    const skipIndex = (page - 1) * size
    const list = await query.skip(skipIndex).limit(size)
    const total = await CommentModel.count(params)
    list.forEach(item => {
      item._doc.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
      item._doc.liked = item.likedUser && !!item.likedUser[deUser?._id]
      delete item._doc.likedUser
    })
    res.status(200).json({ code: 1, data: { page, size, total, list } })
  } catch (e: any) {
    res.status(200).json(genErrRes(e?.message, res))
  }
}
