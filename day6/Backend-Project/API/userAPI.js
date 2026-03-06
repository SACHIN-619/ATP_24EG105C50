//create min-express app(Seprarate route)
//main express server have https instance and mini exp sression doesnt contian https server here only contain router

import exp from 'express'
import {UserModel} from '../models/UserModel.js'
import {hash} from 'bcryptjs'
export const userAPP = exp.Router()


//Define uer Rest api routes
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
userAPP.get('/users',async(req,res)=>{
    //read all users from db
    let usersList = await UserModel.find();
    //send res
    res.status(200).json({message: "User",payload:usersList})
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
    res.status(200).json({message:"User modified", payload:updated})
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


//Status code and its meaning 
//200 success
//201- created
//400-bad req
//401-bad authorization
//404-not found