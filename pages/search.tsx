import {useRouter} from "next/router";
import Header from "@/components/header/header";
import {Empty, Form, Input, List, Pagination} from "antd";
import styles from '@/styles/search.module.sass'
import {SearchOutlined} from "@ant-design/icons";
import React, {useRef} from "react";
import {usePagination} from "@/hooks/usePagination";

const Search = () => {
  const { query, push, replace, pathname } = useRouter()

  const params = useRef({
    searchKey: query.searchKey as string || ''
  })

  const { getList, list, loading, total, pagination, changePage } = usePagination<Article>({ url: '/article/list', query: params })

  function search(val: { searchKey: string }) {
    params.current = {
      searchKey: val.searchKey || ''
    }
    replace(`${pathname}?searchKey=${val.searchKey || ''}`)
    getList()
  }

  const highlightList = list.map(item => {
    const contentIndex = item.content.indexOf(params.current.searchKey)
    if (contentIndex >= 0) {
      item.content = item.content.slice(contentIndex - 20 < 0 ? 0 : contentIndex - 20)
    }
    return {
      ...item,
      title: item.title.replace(new RegExp(params.current.searchKey, 'i'), `<span class="highlight">${params.current.searchKey}</span>`),
      content: item.content.replace(new RegExp(params.current.searchKey, 'i'), `<span class="highlight">${params.current.searchKey}</span>`)
    }
  })

  return (
    <>
      <Header/>
      <div className={styles.search}>
        <Form className="search-form" onFinish={search}>
          <Form.Item name="searchKey" initialValue={params.current.searchKey}>
            <Input suffix={<SearchOutlined/>} placeholder="请输入关键字" />
          </Form.Item>
        </Form>

        <List loading={loading}>
          {
            highlightList.map(art => <List.Item key={art._id} onClick={() => push(`/article/detail?id=${art._id}`)}>
              <List.Item.Meta
                title={<div dangerouslySetInnerHTML={{__html: `${art.title} - ${art.createTime}`}} />}
                description={<div className="article-content" dangerouslySetInnerHTML={{__html: art.content}} />}
              />
            </List.Item>)
          }
          <List.Item className="pagination">
            { total > 0 ? <Pagination
              current={pagination.page}
              pageSize={pagination.size}
              total={total}
              onChange={changePage}
              showSizeChanger={false}
            /> : null }
          </List.Item>
        </List>

        {!loading && !list.length ? <Empty/> : null}
      </div>
    </>
  )
}

export default Search
