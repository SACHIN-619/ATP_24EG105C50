import { validateTitle, validatePriority, validateDueDate } from './validator.js';

const tasks = [];

function addTask(title, priority, duedate) {
    // Check if any validation returns a failure message
    const vTitle = validateTitle(title);
    const vPriority = validatePriority(priority);
    const vDate = validateDueDate(duedate);

    if (vTitle !== "pass" || vPriority !== "set" || vDate !== "date is set") {
        console.error("Validation failed:", { vTitle, vPriority, vDate });
        return "Error";
    }

    // Push as an object to the tasks array
    const newTask = { title, priority, duedate, completed: false };
    tasks.push(newTask);
    return "Task added successfully";
}

function getAllTask() {
    return tasks;
}

export { addTask, getAllTask };