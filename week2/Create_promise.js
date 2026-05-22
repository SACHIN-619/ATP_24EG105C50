//promise
//call in 5 mins
// pending 
//fulfilled or rejected

console.log("friend will call you in 5 sec")
let futureCondition = true
// promise porducer(create promise)
const promiseObj = new Promise((fulfilled, rejected) => {
    setTimeout(()=>{
        if(futureCondition==true){
    fulfilled("Promise fullfilled")
    }
    else{
    rejected("Promise rejected")
    }},1000)
})
// promise consumer

promiseObj
.then(()=>{})
.catch(()=>{})