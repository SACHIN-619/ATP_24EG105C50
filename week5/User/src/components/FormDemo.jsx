import { useForm } from "react-hook-form"

function FormDemo(){
     const {
        register,  //to register form fields
        handleSubmit, //to handle for submission
        formState:{errors},//to handle validations
    }=useForm()  

     //use in a form to destrucing naming says for regiter,submit,errors
//Form submit function
const onFormSubmit=(obj)=>{
    console.log(obj)
}

    return(
        <div>
            <h1 className="text-center text-black">FormDemo</h1>
            <form className='max-w-md mx-auto mt-10' onSubmit={handleSubmit(onFormSubmit)}>
                <div>
                    <label htmlFor="Username"> Username</label>
                    <input type="text"
                   {...register("username",{
                    required:"username required",
                   validate:(v)=>v.trim().length!=0 || "White space is not valid" //it ensures white space is not considered
                   })} //  name="Username"  
                      id="Username"
                       className="border w-full p-3"/>
                </div>

                {/* {username validation error message} */}
                {errors.username?.type=="required" && <p className="text-red-500">* Username required</p>}
                {/* {username validation if length is short} */}
                {errors.username?.type=="minLength" && <p className="text-red-500">Minimum length should 4 character</p>}
                {errors.username?.type=="maxLength" && <p className="text-red-500">Maximum length should 10 character</p>}
      
            
                <div>
                    <label htmlFor="email"> email</label>
                    <input type="text"
                   {...register("email")} //  name="Username"  
                      id="email"
                       className="border w-full p-3"/>
                </div>
                {/* <div>
                    <label htmlFor="email"> </label>
                    <input type="text" name="email" id="email" className="border-w-full p-3">Username</input>
                </div> */}

                <button type="submit" className="text-center bg-red-950 text-white"/>
            </form>
        </div>
    )
}

export default FormDemo



