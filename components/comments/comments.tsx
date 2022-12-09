import {Avatar, Button, Form, Input, List, message, Pagination} from "antd";
import React, {useCallback, useRef, useState} from "react";
import {useHttp} from "@/hooks/useHttp";
import {usePagination} from "@/hooks/usePagination";
import ChildrenComments from "@/components/comments/childrenComments";
import LikeButton from "@/components/comments/likeButton";

interface IProps {
  articleId: string
}

const Comments = ({ articleId }: IProps) => {
  const { post } = useHttp()
  const [form] = Form.useForm()

  const { pagination, total, changePage, getList, list, loading } = usePagination<Comment>({ url: '/comments/list', query: useRef({ article: articleId, parent: '' }) })
  const [current, setCurrent] = useState('')

  const [submitLoading, setSubmitLoading] = useState(false)
  const submit = useCallback((val: any) => {
    setSubmitLoading(true)
    return post('/comments/add', {
      ...val,
      article: articleId
    })
      .then(() => {
        setSubmitLoading(false)
        getList()
        form.setFieldValue('content', '')
      })
      .catch(err => {
        setSubmitLoading(false)
        message.error(err)
      })
  }, [articleId, post, form, getList])

  return (
    <>
      <h4 style={{ marginLeft: '10px' }}>评论</h4>
      <Form
        layout="inline"
        style={{ width: '100%' }}
        onFinish={submit}
        form={form}
      >
        <Form.Item name="content" rules={[{ required: true }]} style={{ width: '1095px' }}>
          <Input placeholder="请输入评论内容" />
        </Form.Item>
        <Button htmlType="submit" type="primary" loading={submitLoading}>发送</Button>
      </Form>
      <List
        loading={loading}
      >
        {
          list.map(item => <List.Item
            key={item._id}
            actions={
              [
                <span key='time'>{item.createTime}</span>,
                <LikeButton key='like' comment={item} />,
                <Button key="rely" size="small" onClick={() => setCurrent(current === item._id! ? '' : item._id!)}>回复</Button>
              ]
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.user?.avatar} />}
              title={<span>{item.user?.nickname || item.user?.username}</span>}
              description={<div>
                {item.content}
              </div>}
            />
            <ul style={{ margin: 0, padding: 0 }}>
              { current === item._id ? <ChildrenComments parent={item._id!} articleId={articleId} /> : null }
            </ul>
          </List.Item>)
        }
        <List.Item className="pagination">
          { total > 0 ? <Pagination current={pagination.page} pageSize={pagination.size} total={total} onChange={changePage} showSizeChanger={false} /> : null }
        </List.Item>
      </List>
    </>
  )
}

export default Comments
