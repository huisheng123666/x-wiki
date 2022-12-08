import {Button, Form, Input} from "antd";
import React, {useState} from "react";

const ChildrenReply = ({ submit, userId }: { submit: (val: any) => Promise<any>, userId: string }) => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()

  const send = (val: any) => {
    setSubmitLoading(true)
    submit({
      ...val,
      relation: userId
    })
      .then(() => {
        form.resetFields()
        setSubmitLoading(false)
      })
      .catch(() => {
        setSubmitLoading(false)
      })
  }

  return (
    <Form
      layout="inline"
      style={{ width: '100%', marginLeft: '45px', marginTop: '5px' }}
      onFinish={send}
      form={form}
      size='small'
    >
      <Form.Item name="content" rules={[{ required: true }]} style={{ width: '900px' }}>
        <Input placeholder="请输入评论内容" />
      </Form.Item>
      <Button htmlType="submit" type="dashed" loading={submitLoading}>发送</Button>
    </Form>
  )
}

export default ChildrenReply
