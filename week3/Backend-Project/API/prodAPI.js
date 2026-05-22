import exp from 'express'
import { ProdModel } from '../models/ProdModel.js'
export const ProdAPP = exp.Router()


ProdAPP.post('/prod',async(req,res)=>{
    let newProd =  req.body
    let newProdDocument =new ProdModel(newProd)
    let result = await newProdDocument.save()


    console.log("result: ",result)
    res.status(201).json({message : "Product Created"})
})


ProdAPP.get('/prod/:id',async(req,res)=>{
    const pid = req.params.id

    const prodObj = await ProdModel.findById(pid)

    if(!prodObj){
        res.status(404).json({message:'Prod not found'})
    }
    res.status(200).json({message:"Product",payload:prodObj})
})


