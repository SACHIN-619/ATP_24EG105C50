function Product(props){
    //state
    //return a react element
    //[productObj]=props;

    const {productObj}=props
    return(
        
       <div>
         {/* <h1>Welcome to Product</h1> */}
        <h2>{productObj.title}</h2>
        <h2>{productObj.price}</h2>
        <h2>{productObj.description}</h2>
       </div>
        
    )
}

export default Product;