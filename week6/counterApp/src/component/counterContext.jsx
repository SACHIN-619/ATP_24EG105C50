import React from 'react'
import {useState,createContext} from 'react'

export const contextproviderObj = createContext()


function counterContext() {
    const [ counter,setCounter] = useState(10)
    const increase=()=>{
        counter+=1
    }
    const decrease=()=>{
        counter-=1
    }
  return (
    <contextproviderObj.Provider value =  {{counter,setCounter}}>
        {children}
    </contextproviderObj.Provider>
  )
}

export default counterContext