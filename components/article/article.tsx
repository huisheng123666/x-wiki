import Link from "next/link";
import styles from './article.module.sass'
import {EyeOutlined} from "@ant-design/icons";

const Article = () => {
  return <Link className={styles.article} href="/article/1">
    <div className="info">
      <div className="text">
        <h4>全网都是数字人，鹅厂的数智人有何不同？</h4>
        <p>全网都是数字人，鹅厂的数智人有何不同？</p>
      </div>
      <div className="data">
        <span className="author">作者：Tina</span>
        <span className="date">2022-12-01</span>
        <span className="view"><EyeOutlined /> 3000</span>
      </div>
    </div>
    <img className="cover" src="https://static001.infoq.cn/resource/image/ce/6c/cebd3f13b5c4dba95cfc66bb6d2dd46c.jpeg?x-oss-process=image/crop,y_180,w_960,h_540/resize,w_416,h_234" alt=""/>
  </Link>
}

export default Article