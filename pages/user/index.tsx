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
import UserArticle from "@/components/user/article";
import Userinfo from "@/components/user/info";

const Index = () => {
  const { asPath, query } = useRouter()

  const items = [
    { label: <Link href='/user'>个人信息</Link>, key: '/user' },
    { label: <Link href='/user?type=article'>我的文档</Link>, key: '/user?type=article' }
  ];

  return (
    <>
      <Header/>
      <div className={styles.user}>
        <Menu className="menus" items={items} selectedKeys={[asPath]} />
        {!query.type ? <Userinfo/> : ''}
        {query.type === 'article' ? <UserArticle/> : ''}
      </div>
    </>
  )
}

export default Index
