import {useForm} from 'react-hook-form'
import {useState} from 'react'
import {useNavigate} from 'react-router'


function CreateEmp() {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState("");
    const {register,HandleSubmit,formState:{errors}}=useForm()

    //form submit
    const onFormSubmit=(newEmpObj)=>{
        console.log(newEmpObj)
        try{
            setLoading(true)
            //make http request
            let res = await fetch('http://localhost:6000/emp-api/employees',{
                
            })
        }
    }
  return (
    <div>
        <h1 className='text-5xl text-center'>Create New Emp</h1>
        <form>
            <input type="text" placeholder='Enter your Name' {...register("name")}></input>
            <input type="text" placeholder='Enter email' {...register("email")}></input>
            <input type="text" placeholder='Enter mobile number' {...register("mobile")}></input>
            <input type="text" placeholder='Enter designation' {...register("designation")}></input>
            <input type="text" placeholder='Enter companyName' {...register("companyName")}></input>
            <button type="submit"></button>
        </form>
    </div>
  )
}

export default CreateEmp