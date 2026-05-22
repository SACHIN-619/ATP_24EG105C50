import {Schema, model} from 'mongoose'


const userSchema = new Schema({
    firstName:{
        type:String,
        required:[true,"first name is required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"]
    },
    password:{
        type:String,
        required:[true,"Password required"]
    },
    role:{
        type:String,
        enum:["USER","AUTHOR","ADMIN"],
        required:[true,"{Value} is invalid role"]
    },
    profileImageURL:{
        type:String
    },
    isUserActive:{
        type:Boolean,
        default:true
    }
},{
    timeStamps:true,
    versionKey:false,
    strict:"throw"
})

export const UserModel=model('users',userSchema)