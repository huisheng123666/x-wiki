import type { NextApiRequest, NextApiResponse } from 'next'
import * as fs from "fs";
import path from "path";


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const text = fs.readFileSync(path.resolve(process.cwd(), './public/personal/index.html'), {
    encoding: 'utf-8'
  })
  res.send(text)
}
