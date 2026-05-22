//Create  express exp
import exp from 'express'
import {connect}  from 'mongoose'
import {userAPP} from './API/userAPI.js'
import {ProdAPP} from './API/prodAPI.js'
import cookieParser from 'cookie-parser'
// const {cookieParser} = pkg
import {config} from 'dotenv'

config();  //process.env.port  process.env.DB_URL

const app=exp()
//add body parser middleware

app.use(exp.json())

app.use(cookieParser())


app.use("/user-api",userAPP)
app.use("/prod-api",ProdAPP)

//connnect to DB server
// connect().then().catch()

const PORT = process.env.port || 4000

async function connectDB(){
    try{
        await connect(process.env.DB_URL)
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