import Header from "@/components/header/header";
import styles from '@/styles/user.module.sass'
import {Button, Form, Input, Menu, message} from "antd";
import Link from "next/link";
import {useAuth} from "@/context/auth-context";
import {useEffect} from "react";
import {useUpload} from "@/hooks/useUpload";
import {validateImg} from "@/pages/editor";
import {useHttp} from "@/hooks/useHttp";
import {useRouter} from "next/router";

const Index = () => {
  const { user, setUser, getUser } = useAuth()
  const [form] = Form.useForm()
  const { upload } = useUpload({ validateFile: validateImg })
  const { post, loading } = useHttp()

  const { asPath } = useRouter()

  const items = [
    { label: <Link href='/user'>个人信息</Link>, key: '/user' },
    { label: <Link href='/user?type=article'>我的文档</Link>, key: '/user?type=article' }
  ];

  useEffect(() => {
    form.setFieldValue('avatar', user?.avatar)
    form.setFieldValue('nickname', user?.nickname || '')
  }, [form, user])

  function saveUserInfo(val: any) {
    post('/user/update', { ...val })
      .then(() => {
        getUser()
        message.success('保存成功')
      })
      .catch(e => {
        message.error(e)
      })
  }

  function uploadAvatar() {
    upload().then(url => {
      setUser({
        ...user!,
        avatar: url
      })
      form.setFieldValue('avatar', url)
    })
      .catch(e => {
        message.error(e)
      })
  }

  return (
    <>
      <Header/>
      <div className={styles.user}>
        <Menu className="menus" items={items} selectedKeys={[asPath]} />
        <div className="userinfo">
          <Form
            layout='horizontal'
            labelCol={{ span: 2 }}
            labelAlign='left'
            onFinish={saveUserInfo}
            form={form}
          >
            <Form.Item label="头像" name="avatar">
              <img className="avatar" src={user?.avatar} alt="" onClick={uploadAvatar} />
            </Form.Item>
            <Form.Item label="用户名">
              <span>{user?.username}</span>
            </Form.Item>
            <Form.Item label="昵称" name="nickname">
              <Input style={{ width: '300px' }} />
            </Form.Item>
            <Form.Item>
              <Button htmlType='submit' style={{ width: '100px', marginLeft: '80px' }} type="primary">保存</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Index
