import type { NextApiRequest, NextApiResponse } from 'next'
import {setCookie} from "@/util/cookies";

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  setCookie(res, 'token', '', { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true })
  res.redirect('/login')
}
