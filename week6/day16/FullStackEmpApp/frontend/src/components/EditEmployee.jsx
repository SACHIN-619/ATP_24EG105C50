import { useForm } from "react-hook-form";
import { useLocation,useNavigate } from "react-router";
import { useEffect } from "react";
import axios from 'axios'


function EditEmployee() {
  const {
    register,
    handleSubmit,formState:{errors},
    setValue
  } = useForm();
  //get empObj from navigate hook

  const navigate = useNavigate();

  const { state } = useLocation();

  useEffect(()=>{
    setValue("name",state.name),
    setValue("email",state.email),
    setValue("mobile",state.mobile),
    setValue("designation",state.designation),
    setValue("companyName",state.companyName)
  },[])


  const savedModifiedEmp = async (modifiedEmp) => {
//console.log(modifiedEmp)
//make http put req
const res = await axios.put(`http://localhost:4000/emp-api/employees/${state._id},modifiedEmp`)
if(res.status==200){
  //navigate to List of Emp
  navigate("/list");
}
}
  return (
    <div>
      <h1 className="text-5xl text-center text-yellow-600">Edit Employee</h1>
      {/* form */}
      <form className=" max-w-md mx-auto mt-10" onSubmit={handleSubmit(savedModifiedEmp)}>
        <input
          type="text"
          placeholder="Enter name "
          {...register("name")}
          className="mb-3 border border-2 p-3 w-full rounded-2xl"
        />
        <input
          type="email"
          placeholder="Enter Email "
          {...register("email")}
          className="mb-3 border border-2 p-3 w-full rounded-2xl"
        />

        <input
          type="number"
          placeholder="Enter mobile number"
          {...register("mobile")}
          className="mb-3 border border-2 p-3 w-full rounded-2xl"
        />
        <input
          type="text"
          placeholder="Enter designation"
          {...register("designation")}
          className="mb-3 border border-2 p-3 w-full rounded-2xl"
        />
        <input
          type="text"
          placeholder="Enter name of the company"
          {...register("companyName")}
          className="mb-3 border border-2 p-3 w-full rounded-2xl"
        />

        <button type="submit" className="text-2xl rounded-2xl bg-green-800 text-white block mx-auto p-4">
          save
        </button>
      </form>
    </div>
  )
}

export default EditEmployee