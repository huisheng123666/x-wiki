import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import article from "@/model/article";
import {genErrRes} from "@/util";
import { Types } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<any>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  try {
    const art = await article.findOne({ _id: req.body.id })
    if (!art) {
      res.status(200).json({ code: 0, message: '文章已删除' })
      return
    }
    const upRes = await article.updateOne({ _id: req.body.id }, { view: art.view + 1 })
    res.status(200).json({ code: 1, data: upRes })
  } catch (err: any) {
    res.status(200).json(genErrRes(err?.message, res))
  }
}
