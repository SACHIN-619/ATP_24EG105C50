import {validateTitle,validatePriority,validateDueDate} from './validator'

const tasks = []

// function addTask(title, priority, duedate){
    
    // const err = new Error("This is new error")
    // try {
        // for(let v of tasks){
        //     v.tasks = "eating"
        //     v.priority="medium"
        //     v.duedate="03-march-2026"
        // }
        
    // } catch (error) {
        
    // }

// }
  function addTask(title, priority, Duedate){
        if(!validateTitle()&&!validatePriority()&&!validateDuedate()){
            return "Error"
        }
        // tasks.push({"Playing","low","12-12-2026"})
    //   return tasks
    return true
    }

  function getAllTask(){
        // for(let v of tasks){
        //     return v
        // }
        return true
    }

    // function markComplete(){
    //  for(let v in tasks){
    //     return `${v} got completed`
    //  }   
    // }

    export {addTask,getAllTask}