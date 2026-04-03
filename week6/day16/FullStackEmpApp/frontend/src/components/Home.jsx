import {useContext} from 'react'
import { counterContextObj } from '../contexts/ContextProvider'
import Test from "./Test"
import { useStoreCounter } from './CounterStore'
function Home() {

  ///cal useCOunter ook from to get state of Zustand store
  // let {newCounter,incrementCounter} = useStoreCounter
  let newCounter = useStoreCounter((state)=>state.newCounter)
  let incrementCounter = useStoreCounter((state)=>state.newCounter)


  const { counter, changeCounter} = useContext(counterContextObj)
  // const { counter1, changeCounter1} = useContext(counterContextObj)
console.log("HOme")

  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={changeCounter} className="bg-amber-300 p-5">Change</button>
      <h1>Counter: {newCounter}</h1>
      <button onClick={incrementCounter} className="bg-amber-300 p-10">Change</button>
    </div>
  )
}

export default Home