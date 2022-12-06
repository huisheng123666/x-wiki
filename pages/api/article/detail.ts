import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import article from "@/model/article";
import dayjs from "dayjs";
import {genErrRes} from "@/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<Article>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  try {
    const art = await article.findOne({ _id: req.body.id }, { __v: 0, _id: 0 }).populate('user', 'username')
    if (!art) {
      res.status(200).json({ code: 0, message: '文章已删除' })
      return
    }
    res.status(200).json({ code: 1, data: art })
  } catch (err: any) {
    res.status(200).json(genErrRes(err?.message))
  }
}
