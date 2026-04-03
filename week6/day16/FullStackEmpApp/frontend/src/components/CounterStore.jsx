//1.import create 
 import {create} from 'zustand'

//2.create store use use word as to understnad create return hook not fun noramlly
 export const useStoreCounter = create((set)=>({  // set always return obj wherese 
    //state
    newCounter:0,
    newCounter1:100,
    //add user state( name,age,email)
    user:{name:"sachin",email:"sachin@gmail.com",age:20},
    //fucntion to email
    changeEmail:()=>set({...user,email:"test@gmail.com"}),
    //function to chnage name and age
    changeNameAndAge:()=>set({...user,name:"sachin kumar",age:19}),
    //functions to modify the state
    incrementCounter:()=>set(state=>({newCounter:state.newCounter+1})),
    incrementCounter1:()=>set(state=>({newCounter1:state.newCounter1+1})),
    decrementCounter:()=>set(state=>({newCounter:state.newCounter-1})),
    // decrementCounter:()=>set(state=>({newCounter1:state.newCounter1-1})),
    reset:()=>set({newCounter:0}),
    //function to change newCounter to 500
    changeCounterto500:()=>set(state=>({newCounter1:state.newCounter1+500})),
    //fucntion to decrement newCounter1 by 20
    DecreCounter1by20:()=>set(state=>({newCounter1:state.newCounter1-20}))
 }))