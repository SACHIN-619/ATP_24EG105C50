//Create  express exp
import exp from 'express'
import {connect}  from 'mongoose'
import {userAPP} from './API/userAPI.js'

const app=exp()

app.use(exp.json())

app.use("/user-api",userAPP)

//connnect to DB server
// connect().then().catch()

async function connectDB(){
    try{
        await connect("mongodb://localhost:27017/anuragdb2")
        console.log("DB connection success")

        //start server
        app.listen(9000,()=>console.log("Server on port 9000.."))
    }
    catch(err){
        console.log("err in DB connection :",err)
    }
}


connectDB()


///error handling middleware
//error=>{name,essage,callback
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