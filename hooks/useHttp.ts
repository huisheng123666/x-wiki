import axios from "axios";
import {useCallback, useEffect, useState} from "react";
import {useAuth} from "@/context/auth-context";
import {axiosOptions} from "@/config";

const instance = axios.create(axiosOptions)

export function useHttp() {
  const { setUser } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    instance.interceptors.response.use((res) => {
      setLoading(false)
      if (res.data.code === 1) {
        return res.data
      } else {
        if (res.data.code === 3) {
          setUser(undefined)
        }
        return Promise.reject(res.data.message)
      }
    }, (err) => {
      return Promise.reject(err.response?.data?.message || err.message)
    })
  }, [setUser])

  const post = useCallback(<P, D>(url: string, data: D) => {
    setLoading(true)
    return instance.post(url, data)
  }, [])

  return {
    post,
    loading
  }
}
