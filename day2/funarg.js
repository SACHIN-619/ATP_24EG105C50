//a function can passed as argument to other function..

   

let makePayment=function(amount,PaymentType){
  console.log(`Paymnt of ${amount} is done`)
  PaymentType()
}

let UPIPayment = function(){
    console.log("Payment is done.")
    }
    
let CardPayment = function(){
    console.log("Payment is done.")

}

makePayment(2000,UPIPayment)