import exp from 'express'
import {config} from 'dotenv'
import { connect } from 'mongoose'
config()

const app = exp()

import { empApp } from './api/employeeApi'
import cors from 'cors'

//add cors middleware

app.use(cors({
  origin:['https://localhost:5173']  //if req is coming from this origin then it will not be blocked
}))


app.use(exp.json())
app.use('emps-api',empApp)

const connectDB=async()=>{

    try{
        await connect(process.env.DB_URL)
        console.log("DB server connected")
        const port=process.env.PORT || 5000
        app.listen(port,()=>console.log(`server listening on ${port}..`))
        
    }
    catch(err){
        console.log('err in DB connect',err)
    }
}

connectDB()

