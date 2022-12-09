import Link from 'next/link'
import styles from './header.module.sass'
import { useRouter } from 'next/router'
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import {Dropdown, Form, Input, MenuProps} from "antd";
import {useAuth} from "@/context/auth-context";

const Header = () => {
  const { pathname, query, push, replace } = useRouter()
  const { user, categories } = useAuth()

  const items: MenuProps['items'] = [
    { label: <Link href="/user">个人中心</Link>, key: 'center' },
    { label: <Link href="/editor">写点啥</Link>, key: 'write' },
    { label: <a href="/api/user/logout">退出</a>, key: 'exit' },
  ];

  function search(val: { searchKey: string }) {
    const url = '/search?searchKey=' + (val.searchKey || '')
    if (pathname.includes('search')) {
      replace(url)
    } else {
      push(url)
    }
  }

  return (
    <div className={styles.header}>
      <div className="nav">
        <span className="logo">X-WIKI</span>
        <div className="links">
          <Link className={pathname === '/' ? 'active' : ''} href="/">首页</Link>
          {
            categories.map(item =>
              <Link
                className={query.type === item.value.toString() ? 'active' : ''}
                href={'/article/' + item.value}
                key={item.value}
              >
                { item.label }
              </Link>)
          }
        </div>

        {
          pathname.includes('search') ? null : <Form style={{ marginRight: '20px' }} onFinish={search}>
            <Form.Item name="searchKey" style={{ marginBottom: 0 }} initialValue={query.searchKey || ''}>
              <Input placeholder="请输入关键字" suffix={<SearchOutlined />} />
            </Form.Item>
          </Form>
        }

        {
          user ? <Dropdown menu={{items}}>
            <div className="user">
              <img src={user?.avatar} alt="" />
              <span>{user?.username} <CaretDownOutlined className="drop" /></span>
            </div>
          </Dropdown> : <div>
            <Link className="login" href="/login">登录</Link>/
            <Link className="login" href="/login?register=1">注册</Link>
          </div>
        }
      </div>
    </div>
  )
}

export default Header
