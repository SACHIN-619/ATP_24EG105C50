//i will send 10000 rupess tmmrw

console.log("Promise made for sending 10000 ru tmrww")
let isFuturecondn = false

let promise = new Promise((fullfilled,rejected)=>{

    setTimeout(()=>{
    if(isFuturecondn==true){
        fullfilled("Money sent..")
    }
    else{
        rejected("Sending Money failed.!")
    }},1000)
})

promise
.then((message)=>console.log(message))
.catch((errormessage)=>console.log(errormessage))

