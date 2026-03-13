//
//Create mini -Express app(Seprarate Route)
import exp from 'express'
export const ProductAPP = exp.Router()

let products =[]
  
 ProductAPP.get('/products',(req,res)=>{
    res.json({message:"All products",payload:products})
 })

 
 ProductAPP.get('/products/:id',(req,res)=>{

    let idOfUrl = Number(req.params.id)
    let product = products.find(prodObj=>prodObj.id==idOfUrl)
    //if products not found
    if(product == undefined){
        return res.status(404).json({message:"Product not found"})
    }

    res.json({message:"Found Products",payload:product})
})

ProductAPP.post('/products',(req,res)=>{
  const newProducts = req.body

  products.push(newProducts)

  res.json({message:"Products Created"})
})

 ProductAPP.put('/products',(req,res)=>{
    let modifiedProduct = req.body
    let index = products.findIndex(prodObj=>prodObj.id==modifiedProduct.id)  //modifiedProduct.id
    //Products not found
    if(index==-1){
        return res.json({message:"Products not found"})
    }
    products.splice(index,1,modifiedProduct)

    res.json({message:"User updated"})
 })


 ProductAPP.delete('/products/:id',(req,res)=>{

    let idOfUrl=Number(req.params.id)
    let index = products.findIndex(prodObj=>prodObj.id=idOfUrl)  //products.findIndex()
    //if products not found
    if(index==-1){
        return res.json({message:"Products not found to delete"})
    }

    products.splice(index,1)

    res.json({message:"Product removed"})
 })