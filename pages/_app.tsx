import '../styles/globals.css'
import type {AppContext, AppProps} from 'next/app'
import App from 'next/app'
import {AuthProvider} from "@/context/auth-context";
import {post} from "@/util/http";
import { useRouter } from "next/router";
import {useEffect} from "react";
import NProgress from "nprogress";
import 'nprogress/nprogress.css'

export default function App1({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const start = () => {
      NProgress.start()
    }
    const end = () => {
      NProgress.done()
      NProgress.remove()
    }
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', end)

    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', end)
    }
  }, [router])

  return <AuthProvider dbCategories={pageProps?.categories} dbUser={pageProps.user}>
    <Component {...pageProps} />
  </AuthProvider>
}

App1.getInitialProps = async (context: AppContext) => {
  const { data } = await post<{ data: Category[] }>({ url: '/article/category', req: context.ctx.req })
  const appContext = await App.getInitialProps(context);
  appContext.pageProps.categories = data
  try {
    // @ts-ignore
    if (context.ctx.req?.cookies.token) {
      const { data: user } = await post<{ data: User }>({url: '/user/info', req: context.ctx.req})
      appContext.pageProps.user = user
    }
    return appContext
  } catch (e) {
    return appContext
  }
}
