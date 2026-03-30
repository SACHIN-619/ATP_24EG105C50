
import { Schema,model,Types } from "mongoose"

const employeeSchema=Schema({
    name:{
        type:String,
        required:[true,"name is empty"]
    },
    email:{
        type:String,
        unique:[true,"Email already exists"],
        required:[true,"email is required"]
    },
    mobile:{
        type:String,
        required:[true,"Mobile no is required"],

    },
    designation:{
        type:String,
        required:[true,"Designation is empty"]
    },
    companyName:{
        type:String,
        required:[true,"Please Enter you company Name"]
    }
})

export const EmployeeSchema = model('emp',EmployeeSchema)