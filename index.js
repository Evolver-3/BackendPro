require("dotenv").config()
const express=require("express")

const app=express()



app.get("/",(req,res)=>{
  res.send("hello world")
})
app.get("/twitter",(req,res)=>{
  res.send("Welcome to Twitter")
})

app.get("/login",(req,res)=>{
  res.send(`<h1>Please logged in with password</h1>`)
})

app.listen(process.env.PORT,()=>{
  console.log(`running on Port ${process.env.PORT}`);
  
})