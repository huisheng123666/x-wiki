## X-WIKI
个人wiki平台

### 简介
使用next.js+mongodb开发的团队文档平台，文档编写使用markdown

> 使用步骤
- 安装依赖  
pnpm install
- 建立本地环境变量
```
// 新建文件.env.local
DB_HOST=mongodb://127.0.0.1:27017/x-wiki // mongodb数据库链接
JWT_SECRET=123456 // jwt密钥
```
- 开发  
pnpm dev
- 生产  
pnpm build  
pnpm start

## 更新
- 2022-12-07

  添加评论点赞功能
  

<details>
  <summary>2022-12-08</summary>
  > 基础功能开发完毕
</details>
