import exp from "express";
import { EmpModel } from "../models/EmpModel.js";
export const empRoute = exp.Router();

//Create emp
empRoute.post("/employees", async (req, res) => {
  const newEmp = req.body;
  const empDoc = new EmpModel(newEmp);
  await empDoc.save();
  res.status(201).json({ message: "Emp created" });
});
//Read all emps
empRoute.get("/employees", async (req, res) => {
  let empList = await EmpModel.find();
  res.status(200).json({ message: "list of emps", payload: empList });
});
//Update emp id
empRoute.put("/employees/:id", async (req, res) => {
  const modifiedEmp = req.body;
  //find and update
  let updatedEmp = await EmpModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: { ...modifiedEmp },
    },
    { returnDocument: "after" },
  );
  if (!updatedEmp) {
    return res.status(404).json({ message: "emp not found" });
  }
  res.status(200).json({ message: "employee updated", payload: updatedEmp });
});

//Delete emp by id
empRoute.delete("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("DELETE request received for ID:", id);
    let deletedEmp = await EmpModel.findByIdAndDelete(id);
    if (!deletedEmp) {
      console.log("Employee not found for ID:", id);
      return res.status(404).json({ message: "Employee not found in database" });
    }
    console.log("Successfully deleted employee:", id);
    res.status(200).json({ message: "employee deleted", payload: deletedEmp });
  } catch (err) {
    console.error("Critical error in DELETE route:", err.message);
    res.status(500).json({ message: "Server error during deletion", reason: err.message });
  }
});