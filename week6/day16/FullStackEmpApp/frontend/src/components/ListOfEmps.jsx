import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from 'axios'


function ListOfEmps() {
  const [emps, setEmps] = useState([]);
  const navigate = useNavigate();
  const gotoEmployee =(empObj)=>{
    //navigate to employee
    navigate("/employee",{state: empObj});
  }
 const gotoEditEmployee =(empObj)=> {
    //navigggate to employee along with selected emp obj
    navigate("/edit-emp",{state:empObj});
  }


  const deleteEmpByID = async (id) => {
    let res = await axios.delete(`http://localhost:4000/emp-api/employees/{id}`)
    if(res.status == 200){
      //get latest emps data
      getEmps()
    }

  }
//get all emps

  async function getEmps() {
    // let res = await fetch("http://localhost:4000/emp-api/employees");
    let res = await axios.get("http://localhost:4000/emp-api/employees");
    if (res.status === 200) {
      // let resObj = await res.json(); //// when we sue fetch
      let resObj =  res.data;
      setEmps(resObj.payload);
    }
  }

  //gte all emps on componenet loading
  useEffect(() => {
    getEmps();
  }, []);

  return (
    <div>
      <h1 className="text-4xl text-center">Employees</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 shadow-">
        {emps.map((empObj) => (
          <div key={empObj._id} className=" bg-white p-5 shadow-blue-700">
            <p>{empObj.email}</p>
            <p>{empObj.name}</p>
            <div>
              <button onClick={()=>gotoEmployee(empObj)} className="bg-green-400 p-2 rounded-2xl">View</button>
              <button onClick={()=>gotoEditEmployee(empObj)}className="bg-orange-400 p-2 rounded-2xl">Edit</button>
              <button onClick={()=>deleteEmpByID(empObj._id)}className="bg-red-600 p-2 rounded-2xl">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListOfEmps;
