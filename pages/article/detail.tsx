import {GetServerSideProps} from "next";
import {post} from "@/util/http";
import Article from "@/components/article/article";
import Header from "@/components/header/header";
import styles from '@/styles/detail.module.sass'
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
// import {dark} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import React, {useEffect, useRef, useState} from "react";
import {useHttp} from "@/hooks/useHttp";
import Comments from "@/components/comments/comments";

const ArticleDetail = ({ article }: { article: Article }) => {
  const { post } = useHttp()

  useEffect(() => {
    post('/article/view', { id: article._id })
  }, [post, article])

  return (
    <>
      <Header/>
      <div className={styles.detail}>
        <h2>{article.title}</h2>
        <p>
          <span>作者：{article.user?.nickname || article.user?.username}</span>
          <span>阅读数：{article.view}</span>
          <span>创建时间：{article.createTime}</span>
        </p>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code: function ({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                // @ts-ignore
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >{article.content}</ReactMarkdown>

        <Comments articleId={article._id!} />
      </div>
    </>
  )
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({res, req, query, params}) => {
  try {
    const { data } = await post<{ data: Article }>({ url: '/article/detail', data: { id: query.id }, headers: { 'Accept-Encoding': 'identity' } })
    return {
      props: {
        article: data
      }
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/error'
      }
    }
  }
}


export default ArticleDetail
