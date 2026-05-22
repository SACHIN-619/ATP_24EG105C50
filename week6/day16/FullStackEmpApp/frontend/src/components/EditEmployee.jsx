import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "axios";

function EditEmployee() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();

  //get empObj from navigate hook
  const { state } = useLocation();
  // console.log(state);

  useEffect(() => {
    setValue("name", state.name);
    setValue("email", state.email);
    setValue("mobile", state.mobile);
    setValue("designation", state.designation);
    setValue("companyName", state.companyName);
  }, []);

  const saveModifiedEmp = async (modifiedEmp) => {
    // console.log(modifiedEmp);
    //make HTTP PUT req
    const res = await axios.put(`/emp-api/employees/${state._id}`, modifiedEmp);
    if (res.status === 200) {
      //navigate to ListOfEMps
      navigate("/list");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">Edit Employee</h1>
      
      <form className="space-y-4" onSubmit={handleSubmit(saveModifiedEmp)}>
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-600">Full Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-600">Email Address</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-600">Mobile Number</label>
          <input
            type="number"
            {...register("mobile")}
            className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-600">Designation</label>
          <input
            type="text"
            {...register("designation")}
            className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-600">Company Name</label>
          <input
            type="text"
            {...register("companyName")}
            className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>

        <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900 transition-colors">
          Update Employee
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;
/*
  const res=await fetch()
  const obj=await res.json()

*/

/*
  const res=await axios.get()
  const obj=res.data

*/