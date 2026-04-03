import {Schema,model,Types} from 'mongoose'

const commentSchema= new Schema({
       user:{
        type:Types.ObjectId,
        ref:"user",
        required:[true,"User ID required"]
       },
       comment:{
        type:String,
        required:[true,"Write comments first"]
       },
})

const articleSchema= new Schema({
     author:{
        type:Types.ObjectId,  //why not string??
        ref:'user',
        required:[true,'Author ID is required']
     },
     title:{
        type:String,
        required:[true,'Title is empty'],
     },
     category:{
        type:String,
        required:[true,"Category is required"],
     },
     contents:{
        type:String,
        required:[true,"Content is required"]
     },
     isArticleActive:{
        type:Boolean,
        default:true
     },
     comment:{type:[commentSchema],default:[]},
},{
    timestamp:true,
    versionKey:false,
    strict:"throw"
})
//create article model
export const ArticleModel = model('article',articleSchema)