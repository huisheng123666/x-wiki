import Header from "../components/header/header";
import {useEffect, useRef, useState} from "react";
import 'easymde/dist/easymde.min.css'
import EasyMDE from "easymde";
import {Button, Form, Input, message, Select} from "antd";
import styles from '../styles/editor.module.sass'
import {useUpload} from "@/hooks/useUpload";
import { useRouter } from "next/router";
import {useHttp} from "@/hooks/useHttp";
import {useAuth} from "@/context/auth-context";

export default function Editor() {
  const easyMDE = useRef<EasyMDE>()
  const [form] = Form.useForm()

  const { push } = useRouter()

  const { post, loading } = useHttp()
  const { upload } = useUpload({ validateFile: validateImg })

  const [cover, setCover] = useState('')

  const { categories } = useAuth()

  useEffect(() => {
    const textarea = document.getElementById('my-text-area')
    import('easymde').then(res => {
      easyMDE.current = new res.default({
        element: textarea!,
        autosave: {
          enabled: true,
          uniqueId: "MyUniqueID"
        },
        minHeight: 'calc(100vh - 610px)'
      });

      easyMDE.current?.value('')
      easyMDE.current?.codemirror.on('change', () => {
        form.setFieldValue('content', easyMDE.current?.value() || '')
      })
    })
    return () => {
      easyMDE.current?.cleanup()
    }
  }, [form])

  function submit(val: any) {
    post('/article/add', val)
      .then(() => {
        push('/')
      })
      .catch(e => {
        debugger
        message.error(e)
      })
  }

  function uploadFile() {
    upload().then(data => {
      form.setFieldValue('cover', data)
      setCover(data)
    }).catch(e => {
      message.error(e)
    })
  }

  return (
    <div className={styles.editor}>
      <Header/>
      <div className="content">
        <Form
          layout="vertical"
          onFinish={submit}
          form={form}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input style={{ width: '400px' }} />
          </Form.Item>
          <Form.Item label="类型" name="category" rules={[{ required: true }]}>
            <Select style={{ width: '400px' }} options={categories} />
          </Form.Item>
          <Form.Item label="封面" name="cover" rules={[{ required: true }]}>
            { !cover ? <div className="upload" onClick={uploadFile}>+</div> : <img className="cover" onClick={uploadFile} src={cover} alt="" /> }
          </Form.Item>
          <Form.Item label="内容" name="content" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
            <Input.TextArea id="my-text-area"></Input.TextArea>
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type='primary' htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export function validateImg({ type, size }: File) {
  if (type.indexOf('jpeg') < 0 && type.indexOf('png') < 0) {
    return '请选择jpg/png图片';
  }
  if (size / 1024 / 1024 > 10) {
    return '请选择不超过2M的图片';
  }
  return '';
}
