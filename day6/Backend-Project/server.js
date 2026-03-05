//Create  express exp
import exp from 'express'
import {connect}  from 'mongoose'
const app=exp()



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