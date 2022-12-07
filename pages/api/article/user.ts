import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import article from "@/model/article";
import dayjs from "dayjs";
import {genErrRes, getToken, verifyToken} from "@/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<PageList<Article>>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  try {
    const { page = 1, size = 10 } = req.body
    const token = getToken(req)
    const deUser = await verifyToken(token)
    const query = article.find({ user: deUser._id }, { __v: 0 }).sort({ createTime: -1 })
    const skipIndex = (page - 1) * size
    const list = await query.skip(skipIndex).limit(size)
    const total = await article.count({ user: deUser._id })
    list.forEach(item => {
      item._doc.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
    })
    res.status(200).json({ code: 1, data: { page, size, total, list } })
  } catch (err: any) {
    res.status(200).json(genErrRes(err.message, res))
  }
}
