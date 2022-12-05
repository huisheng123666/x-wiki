import type { NextApiRequest, NextApiResponse } from 'next'
import category from "@/model/category";
import dbConnect, {isDBConnect} from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResData<Category[]>>
) {
  if (!isDBConnect) {
    await dbConnect()
  }
  const categories = await category.find({}, { __v: 0 })
  res.status(200).json({ code: 1, data: categories })
}