//create HTTP server
import exp from 'express'

import { ProductAPP } from './API/ProductAPI.js'

const app = exp()  // creates expression

// use body parser middleware(in-built)
app.use(exp.json())

//create custom middleware

function middleware2(req,res,next){
    //send res from middleware
    // res.json({message:"This res form middlware2"})

    console.log("middleware2 excuted")
    
    next()

}

function middleware1(req,res,next){
    //send res from middleware
    // res.json({message:"This res form middlware1"})

    console.log("middleware1 excuted")

    next()

}


//use middleware2
app.use(middleware2)
app.use(middleware1)

//forward req to usereAPI if path stratss with /product-API
app.use("/Product-api",ProductAPP)

const port = 3000

//assign port number to HTTP server
app.listen(port, ()=>console.log(`server listening port ${port} ... `))


