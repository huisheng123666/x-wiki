import axios from 'axios'
import {axiosOptions} from "@/config";
import header from "@/components/header/header";

const instance = axios.create(axiosOptions)

instance.interceptors.response.use((res) => {
  if (res.data.code === 1) {
    return res.data
  } else {
    return Promise.reject(res.data)
  }
}, (err) => {
  return Promise.reject({
    code: 0,
    message: err.response?.data?.message || err.message
  })
})

export const post = <T>({ req, data = {}, url, headers = {} }: { req?: any, data?: any, url: string, headers?: any }) => {
  const oHeaders: any = {
    ...headers
  }
  if (!process.browser && req) {
    oHeaders.token = req.cookies.token
  }
  return instance.post<any, T>(url, data, {
    headers: oHeaders
  })
}
