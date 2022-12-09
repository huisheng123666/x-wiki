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

  function uploadFile() {
    upload().then(data => {
      form.setFieldValue('cover', data)
      setCover(data)
    }).catch(e => {
      message.error(e)
    })
  }

  function editorUpload() {
    upload().then(data => {
      easyMDE.current?.value(easyMDE.current?.value() + `![](${data})`)
    })
  }

  return (
    <div className={styles.editor}>
      <Header/>
      <img src="data: image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAAAXNSR0IArs4c6QAABYpJREFUWEfVWX1oVXUYft5zds-1LUXFtaUZGEUfVEgfoObc7kaJqFnGNZ3OTS0xKBEijKjISiEqiIoQpdh0c-rFYG5JlHl3t1EQCZWZoYaRirpVfu7jnnvP74lzrne57W73nnv3keevC_d9n_c57-_9vV9HkO6zb47XM-qme6FjmhAl1JArSnJFMJZgjkDaSVygxjZRbKWm74_QbIE6fQS-xmg6ZsW1UnDJBI8YftFkgZD3A3JzqhgE_wRwmNDqIqprD3y1f6Wqa8ulTra5dJzHMuaJYJ0A9wHwuDHUSzZC4BCJDyK62YCCHedTwUpOdrdfz8q9wadr2msApmdIsjenCIDvLJFN0bNXglgUMAciPTDZH1ZnG-3mWgAvCTA-lbdPR4bARYBbTWW-M1Bo9E82VDbFoLZJRBanQyBNnQNhTT2Hgm1HE-knJtuy7E6vlfU1gMlpGk1fjTwVtlCEkqrfe4P0Jbt_SZ7XY9QC4kvfYmaaBHaZqv0Z-AJXrkXqSdbOndl572qC511lisy49dUmLQJvmq0dG7EoYMUFepA1miqeAFEjQPZg23eLR-CSRSyziirr-5IN-vMNLbteIA-5BR4qeYIHTdUxD77A2f-KAiGe5vI1GvEhIFlDZdw9LqNKsDZSULUZAsbCILR4skHvARG53T3g0GqQPG5KuBiFO086ZLMal7-ii_YWAG1oTfdEp8CEwgEAhyBY1U_hUQRfNwurNgqC_hu9ek49iKJhJUpaEHnP9LRvwIxApydUsVkDVwPSN52SLeFR0bmCYOlUrxgNEEwaRrIK4JbwxDHrcMdHYTtNekLlWzWRFWCi02WrosyzhVZrkM3Dl1dJKuww2zqexaJAp-0gvXH5HF2kRiDj-nOYglojRqjCzqulw-NVkiJ15sW_l2J-fYdzX5rKCnXqAQC5A3EgsdP2bEiDzBoGsgTREGZ7abyMZjWVP6Ir2QNBXjL7CmwSI1T-q0DuTiac2f_2yTMYMUctxKNbLtpYnmDFVE1jHSC3poJN8Ih4QxVnAOT3r0CSaAdwHJApIhjjNr4V0BwxjflxomhacY-X_NJlV3fWjtlLAozujyyBywIsDhdW7kPLyomGZdW5KckCHOyS9jmYFWiLFaCyKQa0rwTuCpDDI5lnCVxQ4IJoYVWTYyxYkW9o2CvAw0mPj_gxbOglmPHpPzHdpbd4JasRgtsS5tOBAW3PJotZJwy-MM9LGZ6svODgfbN8kpEltocfHCB8jmpRFneWbDsdI7pkgqEZ9tE_IIkSf5I3d2I2lWxA2IQlFAlbT2P29taYcbtLy-nHwzwR9prTMa32nCNb9_ho79jxDQQL0iFqQ1zNBqnlWZswIN-bXV1-zN55sj8PkzwjOovC8Tlqt98w8rP3gJibLlHbVjzPuqhgdkTIERPWPBRuP9E7hhVxThRLzOKqw85_u_26kZdTA8AvGTZJTgVz3xs4hH8xVXQhfNXHYzd8xWQvVLWly6vRmZXN8fDzNlZsoWClAHrSyzigwNXeIL2uy-aLY7Rkgemr_M2x07JyNGZ-dtn5TYg3VP4-BS_IYDTz3V1X2v0sCcpRKj7VfexXvWMEy9-GhvWDQhS4pp91jjHdScG5dCeUFV0YKa7-ya5sRmP5yxDZIJntwrqDos-kYB9b-jOY7WH8oQRvCHEXNHlRCCOzGI1rJ5rBuvNmBtNtrPPP8CL1fMXE02081q6bvYFN-HrayDgOvm52XfGQGcktIngqHE11ixgnPAL7WUJ9a6rIKvhqY4Wm1_O_2HwDNEnuMjW1HrOq7ckl4TPS3xRA8GeCn0RUZ03vfaw7z14rPdhfa4hjBD-OMFoPX82pVIpIcs_2RhmM72BK9kZM63M8tr3N3g6mQtSWcU82jjwCXxj_BTiiuQvcZQexAAAAAElFTkSuQmCC" alt=""/>
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
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true }]}
            style={{ marginBottom: 0 }}
            extra={<Button className='editor-upload' type='link' onClick={editorUpload}>上传图片</Button>}
          >
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
