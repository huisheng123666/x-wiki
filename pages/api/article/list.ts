import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import article from "@/model/article";
import dayjs from "dayjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<PageList<Article>>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const params: any = {}
  if (req.body.category) {
    params.category = req.body.category
  }
  const { page = 1, size = 10 } = req.body
  const query = article.find(params, { __v: 0 }).sort({ createTime: -1 })
  query.populate('user', { username: 1, nickname: 1, _id: 0 })
  const skipIndex = (page - 1) * size
  const list = await query.skip(skipIndex).limit(size)
  const total = await article.count(params)
  list.forEach(item => {
    item._doc.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
  })
  res.status(200).json({ code: 1, data: { page, size, total, list } })
}
