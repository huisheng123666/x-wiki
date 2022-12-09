import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import article from "@/model/article";
import dayjs from "dayjs";
import {genErrRes} from "@/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<PageList<Article>>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  try {
    const { category, searchKey } = req.body
    const params: any = {}
    if (category) {
      params.category = category
    }
    if (searchKey) {
      params.$or = [{ title: new RegExp(searchKey, 'i') }, { content: new RegExp(searchKey, 'i') }]
    }
    const { page = 1, size = 10 } = req.body
    const query = article.find(params, { __v: 0 }).sort({ view: -1, createTime: -1 })
    query.populate('user', { username: 1, nickname: 1, _id: 0 })
    const skipIndex = (page - 1) * size
    const list = await query.skip(skipIndex).limit(size)
    const total = await article.count(params)
    const regex = /(<([^>]+)>)/ig
    list.forEach(item => {
      item._doc.createTime = dayjs(item.createTime).format('YYYY-MM-DD')
      item._doc.content = item._doc.content.replace(regex, '')
    })
    res.status(200).json({ code: 1, data: { page, size, total, list } })
  } catch (e: any) {
    res.status(200).json(genErrRes(e?.message, res))
  }
}
