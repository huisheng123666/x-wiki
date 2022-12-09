import {MutableRefObject, useCallback, useEffect, useState} from "react";
import {useHttp} from "@/hooks/useHttp";

interface PParams {
  url: string
  query?: MutableRefObject<any>
}

export function usePagination<T>({ url, query }: PParams) {
  const { post, loading } = useHttp()

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10
  })
  const [total, setTotal] = useState(0)

  const [list, setList] = useState<T[]>([])

  const getList = useCallback((page?: number) => {
    const data = {
      ...pagination,
      ...query?.current
    }
    if (page) {
      data.page = page
    }
    post<PageList<T>, any>(url, data).then(res => {
      setTotal(res.data.total)
      setList(res.data.list)
    })
  }, [pagination, post, query, url])

  const changePage = useCallback((page: number) => {
    setPagination(prevState => ({
      ...prevState,
      page
    }))
    getList(page)
  }, [getList])

  useEffect(() => {
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return {
    pagination,
    total,
    setTotal,
    changePage,
    list,
    setList,
    getList,
    loading
  }
}
