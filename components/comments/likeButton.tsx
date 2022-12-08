import {Button, message} from "antd";
import { HeartOutlined } from '@ant-design/icons'
import {useState} from "react";
import {useHttp} from "@/hooks/useHttp";

const LikeButton = ({ comment }: { comment: Comment }) => {
  const [likeNum, setLikeNum] = useState(comment.like)
  const [isLike, setIsLike] = useState(comment.liked)

  const { post, loading } = useHttp()

  function toggle() {
    post<{ count: number }, any>('/comments/like', {
      liked: !isLike,
      id: comment._id
    })
      .then((res) => {
        setIsLike(!isLike)
        setLikeNum(res.data.count)
      })
      .catch((e) => {
        message.error(e)
      })
  }

  return (
    <Button
      type="text"
      style={{ color: !isLike ? '' : 'red' }}
      icon={<HeartOutlined/>}
      onClick={toggle}
    > {likeNum}</Button>
  )
}

export default LikeButton
