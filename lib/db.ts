import mongoose from "mongoose";
import category from "@/model/category";
import '@/model/user'
import '@/model/article'
import '@/model/category'
import '@/model/comment'

export let isDBConnect = false

function dbConnect() {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.DB_HOST!, (err) => {
      if (err) {
        reject('数据库连接失败')
      } else {
        isDBConnect = true
        resolve(true)
        category.find({})
          .then(res => {
            if (!res.length) {
              category.insertMany([
                {
                  label: '前端',
                  value: 1
                },
                {
                  label: '后端',
                  value: 2
                }
              ])
            }
          })
      }
    })
  })
}

export default dbConnect
