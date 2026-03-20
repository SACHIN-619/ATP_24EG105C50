import {useState} from "react"
function Counter(){
    //state

    //function to modify the state

     const [count,setCount]=useState(0)

     //function to to modifu the state


     const increment=()=>{
        setCount(count+1)
     }

     const decrement=()=>{
        setCount(count-1)
     }

     console.log("Counter Component")


     return(
        <div className="text-center m-20 p-20 border-amber-50">
            <div className="text-6xl">Count: {count}</div>
        <div onClick={increment}>+</div>
        <div onClick={decrement}>-</div>
        </div>
        
     )
}

export default Counter