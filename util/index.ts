import {NextApiRequest, NextApiResponse} from "next";
import jwt from "jsonwebtoken";
import {setCookie} from "@/util/cookies";

export function getToken(req: NextApiRequest): string {
  return req.cookies.token || req.headers.token as string | undefined || ''
}

export function verifyToken(token: string) {
  return new Promise<User>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, data) => {
      if (!err) {
        resolve(data as User)
      } else {
        reject(err)
      }
    })
  })
}

export function genErrRes<T>(msg: string, res: NextApiResponse): ApiResData<T> {
  if (msg.includes('jwt')) {
    setCookie(res, 'token', '', { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true })
    return { code: 3, message: '请完成登录后再操作' }
  }
  return { code: 0, message: '网络错误，请稍后再试' }
}

export function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
