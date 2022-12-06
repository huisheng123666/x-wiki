interface User {
  _id?: string
  username: string
  password: string
  avatar: string
  nickname: string
}

interface ApiResData<T> {
  code: 0 | 1 | 3
  data?: T
  message?: string
}

interface Category {
  _id?: string
  label: string
  value: number
}

interface Article {
  _id?: string
  title: string
  cover: string
  content: string
  user: any
  category: number
  createTime: number
  view: number
}

interface PageList<T> {
  page: number
  size: number
  total: number
  list: T[]
}
