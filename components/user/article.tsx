import {useHttp} from "@/hooks/useHttp";
import {useCallback, useEffect, useState} from "react";
import {Button, List, Modal, Pagination} from "antd";
import Link from "next/link";

const UserArticle = () => {
  const { post, loading } = useHttp()

  const [list, setList] = useState<Article[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10
  })
  const [total, setTotal] = useState(0)

  const getList = useCallback(() => {
    post<PageList<Article>, any>('/article/user', {
      ...pagination
    })
      .then(res => {
        setList(res.data.list)
        setTotal(res.data.total)
      })
  }, [post, pagination])

  useEffect(() => {
    getList()
  }, [getList])

  function changePage(page: number) {
    setPagination({
      ...pagination,
      page
    })
    getList()
  }

  function deleteArticle(id: string) {
    Modal.confirm({
      title: '确认删除吗？',
      onOk: () => {
        post('/article/delete', { id })
          .then(({ data }) => {
            if (data) {
              getList()
            }
          })
      }
    })
  }

  return (
    <div className="user-article right-box">
      <List loading={loading}>
        {
          list.map(item => <List.Item
            key={item._id}
            actions={[
              <Link href={'/editor?id=' + item._id} key='editor'>
                <Button type="primary">编辑</Button>
              </Link>,
              <Button type="primary" danger key='delete' onClick={() => deleteArticle(item._id!)}>删除</Button>
            ]}
          >
            <List.Item.Meta title={item.title} description={item.createTime} />
          </List.Item>)
        }
      </List>
      <Pagination className="pagination" current={pagination.page} pageSize={pagination.size} total={total} onChange={changePage} />
    </div>
  )
}

export default UserArticle
