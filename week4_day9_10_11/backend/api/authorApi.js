import exp from 'express'
import { ArticleModel } from '../models/articleSchema.js'
// import { verifyToken } from './commonApi.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { UserModel } from '../models/usermodel.js'
export  const authorApp = exp.Router()

// Add your author routes here

//read article
//write article(proteced route)
authorApp.post('/article', verifyToken("AUTHOR"), async(req,res)=>{
    try{
    //get articleobj from client
    const articleObj=req.body

    //to check if only uathorize publication
    let author = await UserModel.findById(articleObj.author)


    
    //check author if exists
    if(!author){
        return res.status(404).json({message:"Invalid credentials"})
    }
    //cross check email
    if(author.email!==req.user.email){
        return res.status(403).json({message:"You are not authorize to publish"})
    }
    //check role
    // if(req.user.role !== 'AUTHOR'){
    //     return res.status(403).json({message:"Only Author can publish"})
    // }

    //create article doc
    const articleDoc =new ArticleModel(articleObj)
    //save
    await articleDoc.save()
    //send res
    res.status(200).json({message:"Article created successfully"})
    }
    catch(err){
        res.status(500).json({message:"Error creating article", error:err.message})
    }
})
//Read all articles

authorApp.get('/articles',verifyToken('AUTHOR'),async(req,res)=>{
    try{
    const articlesList = await ArticleModel.find()
    res.status(200).json({message:"articles",payload:articlesList})
    }
    catch(err){
        res.status(500).json({message:"Error fetching articles", error:err.message})
    }
})
//Read own articles

authorApp.get('/article',verifyToken('AUTHOR'),async(req,res)=>{
    try{
    // if(!author.articleDoc){
    //     return res.status(404).json({message:"there is no article"})
        
    // }
    // i(!author.articleDoc.isActiveArticle){
    //     return res.status(404).json({message:"there is no article"})
        
    // }
    // res.status(200).json({message:"Article in Read mode",payload:})



    //read article by author email
//get author id from decoded token
    const authorIdOfToken= req.user?.id
//get articles by author id
    const articleList = await ArticleModel.find({author:authorIdOfToken})

    res.status(200).json({message:"Article List: ",payload:articleList})
    }
    catch(err){
        res.status(500).json({message:"Error fetching articles", error:err.message})
    }
})
//edit article

authorApp.put('/articles',verifyToken('AUTHOR'),async(req,res)=>{
    try{
    //get author id from decoded token
    const authorIdOfToken = req.user?.id

    //get modified article from cliend=t
    const { articleId,title,category,contents} = req.body
    const modifiedArticle = await ArticleModel.findOneAndUpdate(
        {_id:articleId,author:authorIdOfToken},
        {$set:{title,category,contents}},
        // {new:true},
        {return:true},
    )
//if either article id or author not correct
if(!modifiedArticle){
    return res.status(403).json({message:"Not authoried to edit the article"})
}
//send res
res.status(200).json({message: "Article mdoiefied",payload:modifiedArticle})
    }
    catch(err){
        res.status(500).json({message:"Error updating article", error:err.message})
    }
})


authorApp.patch('/articles',verifyToken('AUTHOR'),async(req,res)=>{
    try{
    //get author id from decoded token
    const authorIdOfToken = req.user?.id
    //get modified aritcle from client
    const {articleId, isArticleActive} = req.body
    //get article by id
    const articleOfDB = await ArticleModel.findOne(
        {_id:articleId,author:authorIdOfToken})

    articleOfDB.isArticleActive=isArticleActive

    await articleOfDB.save()
    //send res
    res.status(200).json({message:"Article Modified",payload:articleOfDB})
    }
    catch(err){
        res.status(500).json({message:"Error modifying article", error:err.message})
    }
})