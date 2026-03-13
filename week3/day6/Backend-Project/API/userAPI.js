//create min-express app(Seprarate route)
//main express server have https instance and mini exp sression doesnt contian https server here only contain router

import exp from 'express'
import {UserModel} from '../models/UserModel.js'
import {hash,compare} from 'bcryptjs'
import { verifyToken } from '../middleware/verifyToken.js'
import jwt from 'jsonwebtoken'
import SECRET_KEY from '../.env'

const {sign} = jwt  //default ->destructreand use it

export const userAPP = exp.Router()
//Define uer Rest api routes

//User Login
userAPP.post('/auth',async(req,res)=>{
    //get user cred obj from client
    const {email,password} = req.body
    //verify email
    let user=await UserModel.findOne({email:email})
    //if email not exist
    if(user==null){
        return res.status(404).json({message:"Invalid email"})
    }

    //compare paswords
    let result = await compare(password,user.password)

    //if passwaords not matched
    if(result==false){
        return res.status(400).json({message: " "})
    }
// if passwrd are matched
 //create toke (jsontoken  -jwt --jaat)
   const signedToken = sign({email:user.email},process.env.SECRET_KEY,{expiresIn:"1h"})
    // //send token in res
    // res.status(200).json({message:"login success",payload:signedToken})
    
    //store token as httpOnlu cookeie
    res.cookie("token",signedToken,{

        httpOnly:true,  //equivalent to tick
        sameSite:"lax", //strict? none? 
        secure:false
    })
    //send  res
     res.status(200).json({message:"login success",payload:user})
})
//create new User
userAPP.post("/users",async(req,res)=>{
    //get new user obj from req
    const newUser=req.body;
    const hashPassword=await hash(newUser.password,10)
    //create new User document
    newUser.password=hashPassword
    const newUserDocument = new UserModel(newUser)


    //save
    const result=await newUserDocument.save();
    console.log("result :",result)

    // newUserDocument.save()
    //send res

    res.status(201).json({message: "User Created",payload:result})
    
})


// userAPP.get('./users',async(req,res)=>{
userAPP.get('/user',verifyToken,async(req,res)=>{
    //read user email from req
    const emailOfUser = req.user?.email
    //console.log("EmailOfUser")
    //read all users from db
    //find user by id
    let userObj = await UserModel.findOne({email:emailOfUser}).populate("cart.product")
    //if user not found
    if(!userObj){
        return res.status(404).json({message:"User not found"})
    }
    //send res
    res.status(200).json({message: "User",payload:userObj})
})


//Read a user bu obj Id

userAPP.get("/users/:id",async(req,res)=>{
    //Read object id from req params

    const uid = req.params.id
    //find user bu id
    // const userObj = await UserModel.findOne({_id:uid})
    // const userObj = await UserModel.findById({uid})
    const userObj = await UserModel.findById(uid)
    //send res
    if(!userObj){
        res.status(404).json({message:"User not found"})
    }
    res.status(200).json({message:"user",payload:userObj})
})

//Use findone method to read a boj to no obj id field
//user find by Id read doc. with object id


//update a User bu id
userAPP.put("/users/:id",async(req,res)=>{
    //get modified user form req
    const modifiedUser = req.body;
    const uid = req.params.id;
    //find user bu id and update
    const updatedUser = await UserModel.findByIdAndUpdate(uid,{$set:{...modifiedUser}},
        {new:true,runValidators:true},)

    //send res
    res.status(200).json({message:"User modified", payload:updatedUser})
})


//To delete a User by id
userAPP.delete("/users/:id",async(req,res)=>{
    // let uid=Number(req.params.id)
    let uid=req.params.id

    // let index=users.findIndex(userObj=>userObj.id==idOfUrl)
    
   let deletedUser = await UserModel.findByIdAndDelete(uid)
    if(!deletedUser){
        return res.status(404).json({message:"User not found to delete"})
    }

    // users.splice(index,1)
res.status(200).json({message:"User removed",payload:deletedUser})
    res.json({message:"User removed"})
})



//add product to cart
userAPP.put("/cart/product-id/:pid",async(req,res)=>{
    //get product id from usrl param
    let productid=req.params.pid;
    //get current user details
    const emailOfUser = req.user?.email
    //get user from db
    // const user= await UserModel.findOne({email:emailOfUser})
    //if user is Invalid
    // if(!user){
    //     return res.status(404).json({message:"User not found"})
    // }

    //add product to cart


    //before add. first it should check that product is already in the cart
    //if the product is there, then Increment count by 1
    //otherwise add  that product to cart
    let result=UserModel.findOneAndUpdate({email:emailOfUser},{$push:{cart:{product:productId}}})

//Invalid User
if(!result){
    return res.status(404).json({message:"User not found"})
}
    console.log(result)
    res.json({message:"Product added to cart"})
})

//Status code and its meaning 
//200 success
//201- created
//400-bad req
//401-bad authorization
//404-not found

//app.use(verifyToken)  ---------->every req
//userAPP.get(path,verifyToken,req-handler)--->route-Level middleware not app-level level