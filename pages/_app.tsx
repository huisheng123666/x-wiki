import '../styles/globals.css'
import type {AppContext, AppProps} from 'next/app'
import App from 'next/app'
import {AuthProvider} from "@/context/auth-context";
import {post} from "@/util/http";

export default function App1({ Component, pageProps }: AppProps) {
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
      appContext.pageProps.user = await post<{ data: User }>({url: '/user/info', req: context.ctx.req})
    }
    return appContext
  } catch (e) {
    return appContext
  }
}