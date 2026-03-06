import { Schema,model } from 'mongoose'

//Cerate User Schema(username,password,email,age)
const userSchema = new Schema({  //new is op ,need to create obj
    //Strucutre of User Schema
    username:{
        type:String,
        required:[true,"Username is required"],
        minLength:[4,"Min Length of Uesrnmae is 4 characters"],
        maxLength:[6,"Username size exceeds 6 chars"]
    },
    password:{
        type:String,
        required:[true,"Password required"]
    },

    email:{
        type:String,
        required:[true,"Email required"],
        unique:[true,"Email Exists"]
    },
    age:{
        type:Number
        
    }
        //Designing of the Schema is COmpleted
    },
    {
        versionKey:false,
        timestamps:true
    }
)

//Generate UserModel

export const UserModel =  model("user",userSchema)

//String -0 js datatype
//String -Mongoose Schemma type

//forward req to UerAPP if path starts with  /uer-api
// app.use("/user-api",userAPP)


//connnect to DB server

// async function connection(){

// }


