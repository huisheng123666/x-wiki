import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import Article from "@/model/article";
import {genErrRes, getToken, verifyToken} from "@/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<number>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const token = getToken(req)
  try {
    const deUser = await verifyToken(token)
    const upRes = await Article.updateOne({ _id: req.body.id }, { ...req.body, user: deUser._id })
    res.status(200).json({ code: 1, data: upRes.upsertedCount })
  } catch (err: any) {
    res.status(200).json(genErrRes(err.message, res))
  }
}
