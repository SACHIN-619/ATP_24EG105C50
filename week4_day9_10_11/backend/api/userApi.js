import exp from 'express'
import {verifyToken} from '../middleware/verifyToken.js'
import {ArticleModel} from '../models/articleSchema.js'
export const userApp = exp.Router()

// Add your user routes here  //2 attackscrossScripting attcks and   CSRF(xxrs))

//read articles of all author
userApp.get('/articles',verifyToken,async(req,res)=>{
    try{
    //read status
    const articlesList = await ArticleModel.find()
    //send res
    res.status(200).json({message:"articles",payload:articlesList})
    }
    catch(err){
        res.status(500).json({message:"Error fetching articles", error:err.message})
    }
})
//add cmment to article
userApp.put('/articles',verifyToken("USER"),async(req,res)=>{
    try{
    //no need to verify user id just destrucured
    const {articleId,comment} = req.body
    //check article
    // const articleDocument=await ArticleModel.findById(articleId)
    const articleDocument=await ArticleModel.findOne({_id:articleId,isArticleActive:true})

        //if article not found
        if(!articleDocument){
        return res.status(404).json({message:"Article not found"})
        }
    //get uesr id
    const userId=req.user?.id
    //add comment to comments array of articleDocument
    articleDocument.comment.push({user:userId,comment:comment})
    //save
    await articleDocument.save()
    //send res
    res.status(200).json({message:"Comments added successfully"})
    }
    catch(err){
        res.status(500).json({message:"Error adding comment", error:err.message})
    }
})



//get user id
