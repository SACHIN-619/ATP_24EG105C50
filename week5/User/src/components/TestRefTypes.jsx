import {userState} from "react"

function TestRefTypes(){
    //state
    const [user, setUser]=userState({Username: "sachin" ,age: 20, city: "hyd"})
    const [marks, setMarks]=userState([89,90,89])
    //update user state
    
    const updateUser=()=>{
        setUser({ ...user,username: "Bhanu", age:23})
    }

    const updateMaks=()=>{
        setMarks([...marks,23,90])
    }

    return(

        <div>
             <p>Username:{user.Username}</p>
             <button onClick={updateUser}>
                UpdateUser
             </button>
             <button onClick={updateMaks}>
                UpdateMarks
             </button>

             <button >
                Reset
             </button>
        </div>
    )
}

export default TestRefTypes