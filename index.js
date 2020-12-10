import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectMongo from 'connect-mongo'
import cors from 'cors'
import session from 'express-session'

import routeUser from './routes/users.js'
import routerAlbum from './routes/albums.js'

dotenv.config()

mongoose.connect(process.env.DBURL, { useNewUrlParser: true })

const app = express()

app.use(bodyParser.json())

// 跨域設定
app.use(cors({
  origin (origin, callback) {
    // 如果是 Postman 之類的後端，允許
    if (origin === undefined) {
      callback(null, true)
    } else {
      if (process.env.DEV === 'true') {
        // 如果是本機開發，接受所有請求
        callback(null, true)
      } else if (origin.includes('github')) {
        // 如果不是本機開發，但是是從github過來的請求，允許
        callback(null, true)
        // 如果不是本機開發，也不是從github過來，拒絕
      } else {
        callback(new Error('not allowed'), false)
      }
    }
  },
  credentials: true
}))

const MongoStore = connectMongo(session)

const sessionSettings = {
  secret: 'uptoyoutype',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 1000 * 60 * 30
  },
  saveUninitialized: false,
  rolling: true,
  resave: true
}

if (process.env.DEV === 'false') {
  // 如果不是本機的開發環境，允許不同網域的認證
  sessionSettings.cookie.sameSite = 'none'
  // 如果是不同網域的認證，一定要設定secure
  sessionSettings.cookie.secure = true
}

app.use(session(sessionSettings))

// 部署上 heroku 一定要設定
app.set('truse proxy', 1)

app.use('/users', routeUser)
app.use('/albums', routerAlbum)

// bodyparser cors之類的套件發生錯誤時的處理
// err 發生的錯誤
// next 繼續到下一個middleware，因為是最後一個索引，所以後面不需要。
// 底線代表忽略該參數
app.use((_, req, res, next) => {
  res.status(500).send({ success: false, message: '伺服器錯誤' })
})

app.listen(process.env.PORT, () => {
  console.log('server started')
})
