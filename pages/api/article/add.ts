import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import Article from "@/model/article";
import {genErrRes, getToken, verifyToken} from "@/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<Article>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const token = getToken(req)
  try {
    const deUser = await verifyToken(token)
    const article = await Article.create({ ...req.body, user: deUser._id })
    res.status(200).json({ code: 1, data: article })
  } catch (err: any) {
    res.status(200).json(genErrRes(err.message, res))
  }
}
