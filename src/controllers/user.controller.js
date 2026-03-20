import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import { UploadOnCloudinary } from '../utils/cloudinary.js';


const registerUser = asyncHandler(async(req,res) =>{
   //get user details from frontend
   //validation -not empty
   // check if user already exist : ussername or email
   // check for images, check for avatar
   // upload image to cloudinary, avatar
   // create user object - create entry in db
   // remove password and refreshtoken from response
   // check for user created successfully
   // send response 

   // getting user details from frontend
   const {fullName, email, username, password} = req.body;
   console.log("email: ", email)
   
   //validation -not empty
   if(fullName=="" || email=="" || username=="" || password=="")
   {
       return res.status(400).json({message: "All fields are required"})
   }

   // check if user already exist : ussername or email
   const existingUser = User.findOne({
        $or :[{username}, {email}] 
   })
   if(existingUser)
   {
       return res.status(409).json({message: "User with this username or email already exists"})
   }

   // check for images, check for avatar
   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

   if(!avatarLocalPath)
   {
       return res.status(400).json({message: "Avatar is required"})
   }

   // upload image to cloudinary, avatar
   const avatar = await UploadOnCloudinary(avatarLocalPath);
   const coverImage = await UploadOnCloudinary(coverImageLocalPath);

   if(!avatar)
   {
       return res.status(400).json({message: "Avatar upload failed"})
   }

   //create user object - create entry in db
   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
   })

   // remove password and refreshtoken from response
    const createdUser = await user.findbyId(user._id).select(
        "-password -refreshToken");

        // check for user created successfully
    if(!createdUser)    
    {
        return res.status(500).json({message: "Failed to create user"})
    }
    // send response
    return res.status(201).json({message: "User created successfully", user: createdUser})

}) 
export  {registerUser};