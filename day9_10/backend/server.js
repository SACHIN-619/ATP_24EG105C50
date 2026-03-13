import exp from 'express'
import {config} from 'dotenv'
import {connect} from 'mongoose'
import cookieparser from 'cookie-parser'

config()


const app = exp()


import {userApp} from './api/userApi.js'
import {authorApp} from './api/authorApi.js'
import {adminApp} from './api/adminAPI.js'
import {commonApp} from './api/commonApi.js'

//body parser middeware
app.use(exp.json())
app.use(cookieparser())

app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)
app.use('/auth',commonApp)

//assign port  //connedct to db
const connectDB=async()=>{
// app.listen(port,()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB server connected")
        const port=process.env.PORT  || 5000
        app.listen(port,()=>console.log(`server listening on ${port}..`))
    }
    catch(err){
        console.log('err in DB connect',err)
    }
}


connectDB()


//to handle the invalid path instead of html res we r getting json res.
app.use((req,res,next)=>{
    console.log(req.url)
    res.status(404).json({message:'path ${req.url} is invalid'})
})


app.use((err,req,res,next)=>{
    // res.json({message:"Error occured",error:err.message})
console.log(err.name)
if(err.name=="ValidationError"){
    return res.status(400).json({message:"Error: ",err})
}
//castError-->failed to featch by inalid id given

if(err.name=="CastError"){
    return res.status(400).json({message:"Error: ",err})
}
//send server side eror
res.status(500).json({message:"Error: ",err})
//MongooseError ocuured when a user trying to create with sameil
})