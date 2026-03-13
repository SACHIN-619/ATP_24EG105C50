import exp from 'express'
import { UserModel } from '../models/UserModel'
import { hash } from 'bcryptjs'
export const commonApp=exp.Router()


commonApp.post('/users',async (req,res)=>{
    let allowedRoles=['USER','AUTHOR']
    //get user from req
    const newUser=req.body
    //check roe
    if(!allowedRoles.includes(newUser.role)){
        return res.status(400).json({message:"Invalid response"})
    }

    newUser.password= await hash(newUser,password,12)

    const newUserDoc =  UserModel(newUser)

    await newUserDoc.save()

    res.status(201).json({message:"User Created"})

 
})