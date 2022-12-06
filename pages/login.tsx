import styles from '../styles/login.module.sass'
import {Button, Form, Input, message} from "antd";
import {useCallback, useState} from "react";
import { useRouter } from 'next/router'
import axios from "axios";
import {post} from "@/util/http";

export default function Front() {
  const { query } = useRouter()
  const [loading, setLoading] = useState(false)

  const submit = useCallback((form: any) => {
    setLoading(true)
    post({ url: `/user/${query.register ? 'register' : 'login'}`, data: form })
      .then((data) => {
        location.replace('/')
        setLoading(false)
      })
      .catch((e) => {
        message.error(e.message)
        setLoading(false)
      })
  }, [query])

  return (
    <div className={styles.login}>
      <div className="form-box">
        <h4>X-WIKI</h4>
        <Form
          labelCol={{ span: 4 }}
          onFinish={submit}
        >
          <Form.Item label="用户名" rules={[{ required: true }]} name="username">
            <Input/>
          </Form.Item>
          <Form.Item label="密码" rules={[{ required: true }]} name="password">
            <Input type="password" />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: '100px' }}
              htmlType="submit"
              type="primary"
              loading={loading}
            >{ query.register ? '注册' : '登录' }</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
