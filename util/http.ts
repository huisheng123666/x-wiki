import axios from 'axios'
import {axiosOptions} from "@/config";

const instance = axios.create(axiosOptions)

instance.interceptors.response.use((res) => {
  if (res.data.code === 1) {
    return res.data
  } else {
    return Promise.reject(res.data.message)
  }
}, (err) => {
  return Promise.reject(err.response?.data?.message || err.message)
})

export const post = <T>({ req, data = {}, url }: { req?: any, data?: any, url: string }) => {
  const headers: any = {}
  if (!process.browser && req) {
    headers.token = req.cookies.token
  }
  return instance.post<any, T>(url, data, {
    headers
  })
}
