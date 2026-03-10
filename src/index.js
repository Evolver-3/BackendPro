
import { app } from './app'
import connectDB from './db/db.js'
import dotenv from 'dotenv'

dotenv.config({
  path:"./.env"
})

connectDB().then(()=>{
  app.listen(process.env.PORT || 8000, ()=>{
    console.log(`MONGODB is connected to port ${process.env.PORT}`)
  })

}).catch((error)=>{
  console.log(`Mongodb connection error`, error)
})

