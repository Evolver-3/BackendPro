
// import mongoose from 'mongoose'

// import {DB_NAME} from '../constants.js'

// const connectDB=async()=>{
//   try{

//     const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     console.log(`\n MONGODB id connected !! DB HOST: ${connectionInstance.connection.host}`)

//   }catch(error){
//     console.error(`Error during connection to MONGODB`, error)
//     process.exit(1)
//   }

// }

// export default connectDB

import mongoose from 'mongoose' 
import {DB_NAME} from '../constants.js'

const connectDB=async()=>{
  try{
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n MONGODB id connected !! DB HOST: ${connectionInstance.connection.host}`)

  }catch(error){
    console.error(`Error during connection to MONGODB,error`)
    process.exit(1)
  }
}

export default connectDB