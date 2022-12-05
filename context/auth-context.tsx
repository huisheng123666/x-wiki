import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {post} from "@/util/http";

const AuthContext = createContext<{
  user: User | undefined,
  categories: Category[],
  setUser: (user: User | undefined) => void
} | undefined>(undefined)

AuthContext.displayName = 'AuthContext'

export const AuthProvider = ({ children, dbCategories = [], dbUser }: {children: ReactNode, dbCategories?: Category[], dbUser?: User }) => {
  const [user, setUser] = useState<User | undefined>(dbUser)
  const [categories, setCategories] = useState(dbCategories)


  useEffect(() => {
    post<{ data: User }>({ url: '/user/info' })
      .then(res => {
        setUser(res.data)
      })
  }, [])

  return <AuthContext.Provider value={{ user, categories, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth必须在AuthProvider中使用')
  }
  return context
}