//create HTTP server
import exp from 'express'
const app = exp()  // creates expression

// middleware
app.use(exp.json())


const port = 3000

//assign port number to HTTP server
app.listen(port, ()=>console.log(`server listening port ${port} ... `))


let products =[]
  
 app.get('/products',(req,res)=>{
    res.json({message:"All products",payload:products})
 })

 
 app.get('/products/:id',(req,res)=>{

    let idOfUrl = Number(req.params.id)
    let product = products.find(prodObj=>prodObj.id==idOfUrl)
    //if products not found
    if(product == undefined){
        return res.status(404).json({message:"Product not found"})
    }

    res.json({message:"Found Products",payload:product})
})

app.post('/products',(req,res)=>{
  const newProducts = req.body

  products.push(newProducts)

  res.json({message:"Products Created"})
})

 app.put('/products',(req,res)=>{
    let modifiedProduct = req.body
    let index = products.findIndex(prodObj=>prodObj.id==modifiedProduct.id)  //modifiedProduct.id
    //Products not found
    if(index==-1){
        return res.json({message:"Products not found"})
    }
    products.splice(index,1,modifiedProduct)

    res.json({message:"User updated"})
 })


 app.delete('/products/:id',(req,res)=>{

    let idOfUrl=Number(req.params.id)
    let index = products.findIndex(prodObj=>prodObj.id=idOfUrl)  //products.findIndex()
    //if products not found
    if(index==-1){
        return res.json({message:"Products not found to delete"})
    }

    products.splice(index,1)

    res.json({message:"Product removed"})
 })