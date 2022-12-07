import {Button, Form, Input, message} from "antd";
import {useAuth} from "@/context/auth-context";
import {useUpload} from "@/hooks/useUpload";
import {validateImg} from "@/pages/editor";
import {useHttp} from "@/hooks/useHttp";
import {useEffect} from "react";

const Userinfo = () => {
  const { user, setUser, getUser } = useAuth()
  const [form] = Form.useForm()
  const { upload } = useUpload({ validateFile: validateImg })
  const { post, loading } = useHttp()

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
    <div className="userinfo right-box">
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
  )
}

export default Userinfo
