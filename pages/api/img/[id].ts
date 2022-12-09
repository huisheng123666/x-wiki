import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.send(fs.createReadStream(path.resolve(process.cwd(), './upimgs/' + req.query.id)))
}
