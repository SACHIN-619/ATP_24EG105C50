import exp from 'express'
import { EmployeeSchema, employeeSchema } from '../models/EmployeeSchema'

export const empApp = exp.Router()

empApp.get('/emps',async(req,res)=>{
       const eid = req.params.id

       const empObj = await EmployeeSchema.findById(eid)

       if(!empObj){
        res.status(404).json({message:'Employee not found'})
       }
       res.status(200).json({message:"Employee",payload:empObj})
})

empApp.post('/emps',async(req,res)=>{
  const empObj =  req.body
  
  let newEmpDoc = new employeeSchema(empObj)
  let result = await newEmpDoc.save()

  console.log("result: ",result)
  res.status(201).json({message: "New Employee Created"})
    
})

empApp.put('/emps',async(req,res)=>{

})

empApp.delete('/emps',async(req,res)=>{

})


empApp.put('/emps:id',aysnc(req,res)=>{
    //get modified emp rom re
    const modifiedEmp = req.body;

    //find emp by id and update
    //send res
})