
// import dotenv from 'dotenv'
// import {app} from './app.js'

// import connectDB from './db/db.js'

// dotenv.config({
//   path:'./.env'
// })

// connectDB().
// then(()=>{
//   app.listen(process.env.PORT || 8000,()=>{
//     console.log(`Server is running on port ${process.env.PORT}`)
//   })
// })
// .catch((err)=>{
//   console.log(`MONGO DB connection failed !!`, err)
// })

import dotenv from 'dotenv'
import {app} from './app.js'

import connectDB from './db/db.js'

dotenv.config({
  path:"./.env"
})

connectDB().then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
  })

}).catch((error)=>{
  console.log(`MONGO DB connection failed !!`,error)
})