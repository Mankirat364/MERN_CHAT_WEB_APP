import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { app,server } from './lib/socket.js'
dotenv.config()

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true

}
))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)
const PORT = process.env.PORT || 3000
server.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
    connectDB()
})