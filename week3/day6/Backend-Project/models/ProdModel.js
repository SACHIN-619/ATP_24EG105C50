import {Schema, model} from 'mongoose'

const ProdSchema =new Schema({
    productId:{
        type:String,
        required:[true,"productId is Required"],
    },
    productName:{
        type:String,
        required:[true,"Productname is Required"]
    },
    price:{
        type:Number,
        required:[true,"Price is Required"],
        min:[10000,"minimum Price is 10000"],
        max:[50000,"max price is 50000"]
    },
    brand:{
        type:String,
        required:[true,"brand is required"]
    }
    
},{
    versionKey:false,
    timestamps:true
})

export const ProdModel =  model("product",ProdSchema)