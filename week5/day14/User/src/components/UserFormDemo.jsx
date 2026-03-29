import { useState } from 'react'
import {userForm} from 'react-hook-form'

function UserFormDemo(){
    const {users,SetUsers}=useState([])

     const{
        register,
        handleSubmit,
        formState:{errors},
     }=userForm()

    
//on Form submit
const onFormSubmit=(newUser)
    return(
        <div >
            <h1 className="text-5xl">
                Create User Form
            </h1>
            <form className='bg-yellow-600'>
                <div>
                    <label htmlFor='firstname'>FirstName</label>
                   <input type="text" {...register("username")} className=""/>
                    <label htmlFor='email'>email</label>
                   <input type="text" {...register("email")} className=""/>
                    <label htmlFor='dateOfBirth'>dateOfBirth</label>
                   <input type="date" {...register("dateOfBirth")} className=""/>
                   <button type="submit" className="bg-pink-500">Add User</button>
            </div>
            </form>

            <div>
                <h1>List of Users</h1>
                <table border="none" className="border-collapse:collapse bg-red-400">
                    <tr>
                        <th>firstName</th>
                        <th>email</th>
                        <th>dateOfBirth</th>
                    </tr>
                    <tr>
                        users.map(user,index)={
                                 return(index)=>{
                                          <tr> </tr>   
                                 }
                        }
                    </tr>
                </table>
            </div>
        </div>
    )
}