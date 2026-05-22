import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { CounterContext } from "../store/CounterContext";

function CreateEmp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { increment } = useContext(CounterContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //form submit
  const onFormSubmit = async (newEmpObj) => {
    try {
      setLoading(true);
      //make HTTP POST req
      let res = await fetch("/emp-api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmpObj),
      });

      if (res.status === 201) {
        // Increment global counter
        increment();
        //navigate to employees component programatically
        navigate("/list");
      } else {
        let errorRes = await res.json();
       // console.log("error responce is ", errorRes);
        throw new Error(errorRes.reason);
      }
    } catch (err) {
     // console.log("err in catch", err);
      //deal with err
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //console.log(error);

  if (loading) {
    return <p className="text-center text-4xl">Loading....</p>;
  }
  if (error) {
    return <p className="text-red-500 text-center text-3xl">{error}</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">Create New Employee</h1>
      
      <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
        <input
          type="text"
          placeholder="Enter name"
          {...register("name")}
          className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
        />
        <input
          type="email"
          placeholder="Enter Email"
          {...register("email")}
          className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
        />
        <input
          type="number"
          placeholder="Enter mobile number"
          {...register("mobile")}
          className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
        />
        <input
          type="text"
          placeholder="Enter designation"
          {...register("designation")}
          className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
        />
        <input
          type="text"
          placeholder="Enter name of the company"
          {...register("companyName")}
          className="w-full border-2 border-slate-200 p-3 rounded-lg focus:border-blue-500 outline-none"
        />

        <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900 transition-colors">
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default CreateEmp;


/*

 GET
   fetch(endpoint,{method:"GET"})
 POST
    fetch(endpoint,{ method:"POST",
                    headers:{"Content-Type":app/json}
                    body:JSON.strigfy(resource)
                    })

 PUT
    fetch(endpoint,{ method:"PUT",
                    headers:{"Content-Type":app/json}
                    body:JSON.strigfy(resource)
                    })
*/

/*

 GET
   axios.get(endpoint)
 POST
  axios.post(endpoint,resource)
 PUT
  axios.put(endpoint,resource)

*/