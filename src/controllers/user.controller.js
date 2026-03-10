import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';


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



export {registerUser}