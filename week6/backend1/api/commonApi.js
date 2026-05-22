import exp from 'express'
import { UserModel } from '../models/usermodel.js'
import { hash,compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
const {sign,verify} = jwt
import {config} from 'dotenv'
import { verifyToken } from '../middleware/verifyToken.js'
export const commonApp=exp.Router()


config()



commonApp.post('/users',async (req,res)=>{
    try{
    let allowedRoles=['USER','AUTHOR']
    //get user from req
    const newUser=req.body
    //check roe
    if(!allowedRoles.includes(newUser.role)){
        return res.status(400).json({message:"Invalid response"})
    }
//hash paswword ad replace plain with hashed one
    newUser.password = await hash(newUser.password,12)
//create new user doc
    const newUserDoc = new  UserModel(newUser)

   //save doc 
   await newUserDoc.save()
//send res
    res.status(201).json({message:"User Created"})
    }
    catch(err){
        res.status(500).json({message:"Error creating user", error:err.message})
    }
})

//Route for login (user,author and admin)
commonApp.post("/login",async(req,res)=>{
    try{
    //roles accpoted to login
    // const allowedRolesToLogin=['USER','AUTHOR','ADMIN']  //already assigned valid role no need check again
    //GET USER CREDENTIALS OBJ
const {email,password} = req.body
   //find user
  const user = await UserModel.findOne({email:email})
  //if user not found
  if(!user){
    return res.status(400).json({message:"Invalid credentials"})
  }
  //check password if matched
  const isMatched = await compare(password, user.password)

  if(!isMatched){
    return res.status(400).json({message:"Invalid password"})
  }
  //create jwt
    const signedToken = sign({id:user._id,email:email,role:user.role},process.env.SECRET_KEY,{expiresIn:"1h"})
  //set token to res header as httpOnly cookie
  res.cookie("token",signedToken,{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
  })
  //remove password from user doc -> 
  let userObj=user.toObject()
  delete userObj.password
  //send res
  res.status(200).json({message:"Login successful", user: userObj})
    }
    catch(err){
        res.status(500).json({message:"Error logging in", error:err.message})
    }
})



commonApp.get('/logout',async(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
        
    })

    res.status(200).json({message:"Logout successful"})
})


//change passsword
commonApp.put("/password",verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
    const user = req.cookies?.body
    //check current password and new password are same
    //get current [assword of user/admin/author
    const {email,Currpassword} = req.body
    //chck the current password of req and user are same
    if(user.password==Currpassword){
        return res.status(402).json({message:"New password cannot be same as old password"})
        
    }
    //hash new passwords
   hashedPwd = hash(Currpassword,12)

    // replace the current password of user wih hashed new password
     const UserDoc =await UserModel.findByIdAndUpdate({_id:{$set:{password:Currpassword}}})
    //save
    UserDoc.save()
    //send res
    res.status(200).json({message:"Password Modified Successsfully"})
})