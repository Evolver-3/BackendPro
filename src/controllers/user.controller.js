import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshToken=async(userId)=>{
  try{
    const user =await User.findById(userId)

    // console.log(user)

    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()

   
    // console.log("Access",accessToken)
    // console.log("Refresh",refreshToken)

    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}

  }catch(error){
    
    console.log("Error", error)
    throw new ApiError(500,"Something went wrong while generating access and refresh token!!")
  }
}


const registerUser=asyncHandler(async(req,res)=>{
  
  const {fullname,email,password,username}=req.body;

  console.log(fullname,email);

 if(
  [fullname,email,username,password].some((field)=>
  String(field)?.trim()=== "")
 ){
  throw new ApiError("All fields are required !!", 400)
 }

 const ExistedUser=await User.findOne({
  $or:[
    {email},
    {username}
  ]
 })

 if(ExistedUser){
  throw new ApiError("User with the same email or username already exists !!",409)
 }

 const avatarLocalPath=req.files?.avatar[0]?.path
 const coverImageLocalPath=req.files?.coverImage[0]?.path

 if(!avatarLocalPath){
  throw new ApiError("Avatar Photo is required",400)
 }

 const avatar=await uploadToCloudinary(avatarLocalPath)
 const coverImage=await uploadToCloudinary(coverImageLocalPath)


 if(!avatar){
  throw new ApiError("Avatar file is required",400)
 }

 const user=await User.create({
  fullname,
  avatar:avatar.url,
  coverImage:coverImage?.url || "",
  email,
  password,
  username:username.toLowerCase()
 })

 const createdUser=await User.findById(user._id).select("-password -refreshToken")

 if(!createdUser){
  throw new ApiError(500, "Something went wrong  while registering user !!")
}
console.log(req.files)

return res.status(201).json(
  new ApiResponse(200,createdUser,"User registered successfully !!")
)


  
})


const loginUser=asyncHandler(async(req,res)=>{

  const {email,username,password}=req.body

  if(!(username || email)){
    throw new ApiError("Email and username are required !!",400)
  }

  const user=await User.findOne({
    $or:[{email},{username}]
  })

  if(!user){
    throw new ApiError("Invlid credentials !!", 404)
  }
  // console.log(user)
  

  const isPasswordCorrect=await user.isPasswordCorrect(password)

  if(!isPasswordCorrect){
    throw new ApiError("Password incorrect !!", 400)
  }
  
  // console.log(isPasswordCorrect)

  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

  const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

  const options={
    httpOnly:true,
    secure:false
  }
  

  return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
    new ApiResponse(200, {
      user:loggedInUser,accessToken,refreshToken
    },"User logged In Successfully!!")
  )
  
})

const logoutUser=asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(
    req.user._id,
      {
        $set:{
          refreshToken:undefined
        }
      },
        {
          returnDocument:"after"
        }
  )

  const options={
    httpOnly:true,
    secure:true
  }

  return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200, {},"User Logged Out"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized access")
  }

  try {
    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
    const user=User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401,"Invalid Refresh Token")
    }
  
    
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh token is expired or used")
    }
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
  
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
      new ApiResponse(200,{
        accessToken,refreshToken:newRefreshToken
      },"Access Token successfully")
    )
  } catch (error) {
    throw new ApiError(401,error?.message ||"Invalid refreshToken")
    
  }
})

export {registerUser,loginUser,logoutUser,refreshAccessToken}