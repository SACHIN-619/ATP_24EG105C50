import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";


import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common";

import toast
 from "react-hot-toast";

import { NavLink, useNavigate, useLocation } from "react-router";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const navigate = useNavigate()
  const {login,currentUser,loading,error,isAuthenticated} = useAuth((state) => state)
  const onUserLogin = (userCredObj) => {
    //call login () of ath stores
    console.log(userCredObj);
  };

  console.log("current user", currentUser)
  if(loading){
    return <p className="loadingClass">Loading...</p>
  }

  useEffect(()=>{
    //navigation login
    if(isAuthenticated == true){
      if(currentUser.role=='USER'){
        //shows success toast
        toast.success("Login success and redirectling to Profile",{duration:4000})
        navigate('/user-profile')
      }
      if(currentUser.role=='AUTHOR'){
        toast.success("Login success and redirectling to Profile",{duration:4000})
        navigate('/author-profile')
      }
      if(currentUser.role=='ADMIN'){
        toast.success("Login success and redirectling to Profile",{duration:4000})
        navigate('/admin-profile')
      }
    }
  },[isAuthenticated])
  // },[currentUser],[isAuthenticated])

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>Sign In</h2>

        {/* API error */}
        {/* {error && <p className={errorClass}>{error}</p>} */}

        <form onSubmit={handleSubmit(onUserLogin)}>
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",

                validate: (value) => value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                validate: (value) => value.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* Forgot password */}
          <div className="text-right -mt-2 mb-4">
            <a href="/forgot-password" className={`${linkClass} text-xs`}>
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className={submitBtn}>
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-5`}>
          Don't have an account?{" "}
          <NavLink to="/register" className={linkClass}>
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;