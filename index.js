import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app=express()

app.get("/",(req,res)=>{
  res.send("Good morning")
})

app.get("/api/jokes",(req,res)=>{
  const jokes=[
    {
      id:1,
      joke:"Why don't scientists trust atoms? Because they make up everything!",
      content:"This joke plays on the double meaning of 'make up' - atoms are the building blocks of matter, but 'make up' can also mean to fabricate or lie."
    }
    ,{
      id:2,
      joke:"Why did the scarecrow win an award? Because he was outstanding in his field!",
      content:"This joke is weird, i know it but make sure to play along"
    }
  ]
  res.send(jokes)
})

app.listen(process.env.PORT,()=>{
  console.log(`Server is running on port ${process.env.PORT}`)
})