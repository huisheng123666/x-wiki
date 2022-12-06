import styles from '@/styles/Home.module.sass'
import Header from "@/components/header/header";
import Article from "@/components/article/article";
import {GetServerSideProps} from "next";
import {post} from "@/util/http";
import {Pagination} from "antd";
import { useRouter } from "next/router";

export default function Category({ page, size, total, list }: PageList<Article>) {
  const { replace, pathname } = useRouter()

  function changePage(e: number) {
    replace(`/?page=${e}&size=${size}`)
  }

  return (
    <div className={styles.container}>
      <Header/>
      <div className="list">
        {
          list.map(item => <Article article={item} key={item._id} />)
        }
        <Pagination className="pagination" current={page} pageSize={size} total={total} onChange={changePage} />
      </div>
    </div>
  )
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({res, req, query, params}) => {
  try {
    const body = {
      page: Number(query.page) || 1,
      size: Number(query.size) || 10,
      category: Number(params?.type) || ''
    }
    const { data } = await post<{ data: PageList<Article> }>({ url: '/article/list', data: body, headers: { 'Accept-Encoding': 'identity' } })
    return {
      props: {
        ...data
      }
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/error'
      }
    }
  }
}
