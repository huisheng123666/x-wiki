import {Avatar, Button, Form, Input, List, message, Pagination} from "antd";
import {usePagination} from "@/hooks/usePagination";
import React, {useCallback, useRef, useState} from "react";
import {useHttp} from "@/hooks/useHttp";
import ChildrenReply from "@/components/comments/childrenReply";
import LikeButton from "@/components/comments/likeButton";

const ChildrenComments = ({ parent, articleId }: { parent: string, articleId: string }) => {
  const [form] = Form.useForm()
  const { post } = useHttp()

  const { pagination, total, changePage, getList, list, loading } = usePagination<Comment>({ url: '/comments/list', query: useRef({ parent }) })

  const [submitLoading, setSubmitLoading] = useState(false)
  const [current, setCurrent] = useState('')

  const submit = useCallback((val: any) => {
    setSubmitLoading(true)
    return post('/comments/add', {
      ...val,
      article: articleId,
      parent
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
  }, [articleId, post, form, getList, parent])

  return (
    <List
      loading={loading}
    >
      <List.Item>
        <Form
          layout="inline"
          style={{ width: '100%' }}
          onFinish={submit}
          form={form}
          size="small"
        >
          <Form.Item name="content" rules={[{ required: true }]} style={{ width: '1010px' }}>
            <Input placeholder="请输入评论内容" />
          </Form.Item>
          <Button htmlType="submit" type="primary" ghost loading={submitLoading}>发送</Button>
        </Form>
      </List.Item>
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
            title={
              <div>
                {item.user?.nickname || item.user?.username}
                {item.relation ? <span style={{color: 'orange'}}> &gt; {item.relation?.nickname || item.relation?.username}</span> : null}
              </div>
            }
            description={item.content}
          />
          { current === item._id ? <ChildrenReply submit={submit} userId={item.user?._id} /> : null }
        </List.Item>)
      }
      <List.Item className="pagination">
        { total > 0 ? <Pagination
          size="small"
          current={pagination.page}
          pageSize={pagination.size}
          total={total}
          onChange={changePage}
          showSizeChanger={false}
        /> : null }
      </List.Item>
    </List>
  )
}

export default ChildrenComments
