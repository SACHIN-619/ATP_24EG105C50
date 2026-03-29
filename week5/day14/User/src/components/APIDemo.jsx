import { useEffect } from "react";

function APIDemo(){

    let {count,setCount}=userState(100)
    const changeCount=()=>{
        setCount(count+1)
    }



    // useEffect(()=>{sideeffect function, dependency(if it is not their then rendering will be not done only once)

    useEffect(()=>{
        console.log("UserEffect excuted")

    },[])

    console.log("API demo rendering")
    //Making API Demo to be in waiting state until initial display(rendering)
    //inital rendering->display->api call(sizeeffect)->rerendeering->display

    let {users,setUsers} = userState([])
    let [loading,setLoading] = userState(false)
    let [error,setError] = useState(null)

    useEffect(()=>{
        //a  function to make api req
        async function getData(){
            //set loading to true
            setLoading(true)
            try{
                let res = await fetch("https://jsonplaceholder.typicode.com/comments")
                let usersList = await res.json();
                //update state
                setUsers(usersList);

            }
            catch(err){
                console.log("err is",err)
                //update error state
                setError(error)
            }
        }
        //call
        getData()
    },[])  //[]-->if dependency not included it leads to calling api again and agin till infite which is dengerous


//deal with lading states
if(loading){
    return <p className="text-center text-8xl">Loading .....</p>
}

//deal with error state
if(error!=null){
    return <p className="text-center text-red-500 text-5xl">{error}</p>
}

    return(
        <div className="text-center mt-10"> 
          <p>API demo</p>
          <h1 className="text-8xl text-blue-400">Users List</h1>
        {/* <button onClick={changeCount}> */}
         {/* increase
          */}
        {/* </button> */}
       
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
             {users.map((userObj)=>(
            <div key={userObj.id}> </div>
        ))}
        </div>
    
        </div>
    )
}

export default APIDemo