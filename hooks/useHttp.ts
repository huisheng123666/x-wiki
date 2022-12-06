import {useCallback, useEffect, useRef, useState} from "react";
import {useAuth} from "@/context/auth-context";
import { post as axPost } from "@/util/http";

export function useHttp() {
  const { setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const isMount = useRef(false)

  useEffect(() => {
    isMount.current = true
    return () => {
      isMount.current = false
    }
  }, [])

  const post = useCallback(<P, D>(url: string, data: D) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      axPost({ url, data })
        .then(data => {
          if (isMount.current) {
            resolve(data)
          } else {
            reject('component is destroyed')
          }
        })
        .catch(e => {
          if (e.code === 3) {
            setUser(undefined)
          }
          reject(e.message)
        })
    })
  }, [setUser])

  return {
    post,
    loading
  }
}
