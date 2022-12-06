import Link from "next/link";
import styles from './article.module.sass'
import {EyeOutlined} from "@ant-design/icons";

const Article = ({ article }: { article: Article }) => {
  return <Link className={styles.article} href={"/article/detail?id=" + article._id}>
    <div className="info">
      <div className="text">
        <h4>{article.title}</h4>
        <p>{article.content}</p>
      </div>
      <div className="data">
        <span className="author">作者：{article.user.nickname || article.user.username}</span>
        <span>创建时间：{article.createTime}</span>
        <span className="view"><EyeOutlined /> {article.view}</span>
      </div>
    </div>
    <img className="cover" src={article.cover} alt=""/>
  </Link>
}

export default Article
