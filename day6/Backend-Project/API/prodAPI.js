import exp from 'express'
import { ProdModel } from '../models/ProdModel'
export const ProdAPP = exp.Router()


ProdAPP.GET('/Prod',async(req,res)=>{
    const newProd =  req.body
    const newProdDocument =new ProdModel(newProd)
    const result = await newProdDocument

    console.log(result)
})

