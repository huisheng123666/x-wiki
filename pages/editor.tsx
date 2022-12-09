import Header from "../components/header/header";
import {useCallback, useEffect, useRef, useState} from "react";
import 'easymde/dist/easymde.min.css'
import EasyMDE from "easymde";
import {Button, Form, Input, message, Select} from "antd";
import styles from '../styles/editor.module.sass'
import {useUpload} from "@/hooks/useUpload";
import { useRouter } from "next/router";
import {useHttp} from "@/hooks/useHttp";
import {useAuth} from "@/context/auth-context";
import {Spin} from 'antd/lib';
import {marked} from 'marked';
import use = marked.use;

export default function Editor() {
  const easyMDE = useRef<EasyMDE>()
  const [form] = Form.useForm()

  const { push, query, back } = useRouter()

  const { post, loading } = useHttp()
  const { upload } = useUpload({ validateFile: validateImg })

  const [cover, setCover] = useState('')

  const { categories } = useAuth()

  const setEditValue = useCallback(() => {
    post<Article, any>('/article/detail', { id: query.id })
      .then(({ data }) => {
        form.setFieldsValue({
          title: data.title,
          category: data.category,
          cover: data.cover,
          content: data.content
        })
        setCover(data.cover)
        easyMDE.current?.value(data.content)
      })
  }, [post, query, form])

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

      if (query.id) {
        setEditValue()
      }
    })
    return () => {
      easyMDE.current?.cleanup()
    }
  }, [form, setEditValue, query])

  function submit(val: any) {
    const data = {
      ...val
    }
    if (query.id) {
      data.id = query.id
    }
    post(`/article/${query.id ? 'update' : 'add'}`, data)
      .then(() => {
        query.id ? back() : push('/')
      })
      .catch(e => {
        message.error(e)
      })
  }

  const [coverLoading, setCoverLoading] = useState(false)

  function uploadFile() {
    setCoverLoading(true)
    upload().then(data => {
      form.setFieldValue('cover', data)
      setCover(data)
      setCoverLoading(false)
    }).catch(e => {
      message.error(e)
      setCoverLoading(false)
    })
  }

  const [editorUploadLoading, setEditorUploadLoading] = useState(false)

  function editorUpload() {
    setEditorUploadLoading(true)
    upload().then(data => {
      easyMDE.current?.value(easyMDE.current?.value() + `![](${data})`)
      setEditorUploadLoading(false)
    }).catch(e => {
      message.error(e)
      setEditorUploadLoading(false)
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
            <div className="upload-wrapper">
              { !cover ?
                <div className="upload" onClick={uploadFile}>+</div> :
                <img className="cover" onClick={uploadFile} src={cover} alt="" />
              }
              {coverLoading ? <Spin className="upload-loading" /> : null}
            </div>
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true }]}
            style={{ marginBottom: 0 }}
            extra={<Button loading={editorUploadLoading} className='editor-upload' type='link' onClick={editorUpload}>上传图片</Button>}
          >
            <Input.TextArea id="my-text-area"/>
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
  if (type.indexOf('image') < 0) {
    return '请选择图片';
  }
  if (size / 1024 / 1024 > 10) {
    return '请选择不超过2M的图片';
  }
  return '';
}
