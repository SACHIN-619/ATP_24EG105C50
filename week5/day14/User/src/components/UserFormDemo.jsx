import { useState } from "react";
import { useForm } from "react-hook-form";

function UserFromDemo() {
  const [users, setUsers] = useState([]);
  const { register, handleSubmit } = useForm();

  //on form submit
  const onFormSubmit = (newUserObj) => {
    console.log(newUserObj);
    setUsers([...users, newUserObj]);
  };

  console.log(users);

  return (
    <div className="mt-5">
      {/* create User form */}
      <h1 className="text-5xl text-center">Create User</h1>
      <form className="max-w-md mx-auto mt-10" onSubmit={handleSubmit(onFormSubmit)}>
        {/* First name */}
        <div className="mb-3">
          <label htmlFor="fn">FirstName</label>
          <input type="text" {...register("firstName")} id="fn" className="w-full p-3 border" />
        </div>
        {/* Email*/}
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input type="email" {...register("email")} id="email" className="w-full p-3 border" />
        </div>
        {/* First name */}
        <div className="mb-3">
          <label htmlFor="fn">Date of Birth</label>
          <input type="date" {...register("dateOfBirth")} id="fn" className="w-full p-3 border" />
        </div>
        <button type="submit" className="bg-sky-300 p-3">
          Add New User
        </button>
      </form>

      {/* Table to dusplay List of Users */}
      <table className="mt-5 border mx-auto text-3xl">
        <thead>
          <tr>
            <th>First name</th>
            <th>Email</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {users.map((userObj, index) => (
            <tr key={index}>
              <td>{userObj.firstName}</td>
              <td>{userObj.email}</td>
              <td>{userObj.dateOfBirth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserFromDemo;