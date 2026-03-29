import {useState} from "react"
// import {userHook} from "react"

function Counter(){
    //state

    //function to modify the state

     const [count,setCount]=useState(0)

     //function to to modifu the state

//event handler functions to modify the state
     const increment=()=>{//non parameterized
        setCount(count+1)
     }

     const decrement=()=>{
        setCount(count-1)
     }

     const reset=(value)=>{
      setCount(value)
     }

     console.log("Counter Component")


     return(
        <div className="text-center m-20 p-20 border-amber-50">
            <div className="text-6xl">Count: {count}</div>
        <div onClick={increment}>+</div>
        <div>
         <button>
                           onClick={decrement} </button>-</div>
        
        <diiv>
         <button>
               onclick={()=>reset(0)}
         </button>
        </diiv>
        </div>
        
     )
}

export default Counter