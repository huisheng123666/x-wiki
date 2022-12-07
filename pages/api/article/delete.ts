import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, {isDBConnect} from "@/lib/db";
import article from "@/model/article";
import {genErrRes, getToken, verifyToken} from "@/util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<number>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  try {
    const token = getToken(req)
    const deUser = await verifyToken(token)
    const query = await article.deleteOne({ user: deUser._id, _id: req.body.id })
    res.status(200).json({ code: 1, data: query.deletedCount })
  } catch (err: any) {
    res.status(200).json(genErrRes(err.message, res))
  }
}
