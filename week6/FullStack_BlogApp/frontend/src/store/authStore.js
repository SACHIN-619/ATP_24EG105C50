import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCredWithRole) => {
    try {
      set({ loading: true });
      const res = await axios.post("http://localhost:4000/auth/login", userCredWithRole);
      if (res.status === 200) {
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:4000/auth/logout");
      if (res.status === 200) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },
}));











// import { create } from 'zustand'
// import axios from 'axios'


// export const useAuth = create((set) => ({
//   currentUser: null,
//   loading: false,
//   isAuthenticated: false,
//   error: null,
//   login: async (userCredWithRole) => {
//     // const { role, ...userCredObj } = userCredWithRole;
//     try {
//       //set loading true
//       set(state=>({ ...state,loading:true }))
//       //make api call
//       let res=await axios.post("http://localhost:4000/auth/login",{userCredWithRole:true})
//       //update state
//       if(res.status == 200){
//         set({ 
//                 currentUser:res.data?.payload,
//                 loading:false,
//                 isAuthenticated:true,
//                 error:null,
//           })
//       }
//     } catch (err) {
//       console.log("err is ", err);
//       set({
//         loading: false,
//         isAuthenticated: false,
//         currentUser: null,
//         //error: err,
//         error: err.response?.data?.error || "Login failed",
//       });
//     }
//   },
//   logout: async () => {
//     try {
//       //set loading state
//       set((state)=>state.loading=true)
//       //make logout api req
//       let res = await axios.get('http://localhost:4000/auth/logout',{userCredWithRole})
//       //update state
//     } catch (err) {
//       set({
//         loading: false,
//         isAuthenticated: false,
//         currentUser: null,
//         error: err.response?.data?.error || "Logout failed",
//       });
//     }
//   },
// }));