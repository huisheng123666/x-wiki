import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.sass'
import Header from "../components/header/header";
import Article from "../components/article/article";

export default function Home(props: any) {
  return (
    <div className={styles.container}>
      <Header/>
      <div className="list">
        <Article/>
      </div>
    </div>
  )
}