// .OTP Countdown Simulator (Console App)
// ------------------------------------
        
//         Simulate OTP sending flow in Node.js:
        
//         Show “OTP Sent Successfully”
        
//         Start 10-second countdown
        
//         Allow resend only after countdown ends

console.log("OTP Sent successfully...")
let i=10
// while(i<10){
let interval=setInterval(()=>{
    // for(let i=0;i<10;i++){
    // while(i<11)
        console.log(i)
    // }
    i--;
    
    if(i==0){
    // setTimeout(()=>{
        clearInterval(interval)
        console.log("Resend otp enabled")
    // },10000)
    }
},1000)