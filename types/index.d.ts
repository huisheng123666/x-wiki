interface User {
  _id?: string
  username: string
  password: string
  avatar: string
}

interface ApiResData<T> {
  code: 0 | 1 | 3
  data?: T
  message?: string
}

interface Category {
  _id?: string
  label: string
  value: string
}

interface Article {
  _id?: string
  title: string
  cover: string
  content: string
  user: any
}
