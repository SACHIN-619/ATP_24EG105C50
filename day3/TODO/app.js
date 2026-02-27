import { addTask, getAllTask } from './task.js';

// Testing the flow
console.log(addTask("Sleeping", "high", "2026-12-12"));
console.log(addTask("Gym", "low", "2026-05-01"));

// View all tasks
// console.table(getAllTask());
// console.log(getAllTask())

getAllTask()