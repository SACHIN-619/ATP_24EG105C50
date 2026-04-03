import {createContext} from 'react'
import { useStoreCounter } from './CounterStore'

function Test() {

    let counter1 = useStoreCounter((state)=>state.newCounter1)
    let counter1 = useStoreCounter((state)=>state.newCounter1)
  return (
    <div>Test</div>
  )
}

export default Test