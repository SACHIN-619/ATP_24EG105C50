function validateTitle(title) {
    if (!title) return "title required";
    
    // Use .length instead of len()
    if (title.length > 3) {
        return "pass";
    } else {
        return "fail to create title";
    }
}

function validatePriority(priority) {
    // Use || (OR) because it can only be one of these three
    if (priority === "low" || priority === "medium" || priority === "high") {
        return "set";
    } else {
        return "failed to set priority";
    }
}

function validateDueDate(date) {
    const inputDate = new Date(date);
    const comparisonDate = new Date('2026-02-25'); // Standard ISO format YYYY-MM-DD

    if (inputDate > comparisonDate) {
        return "date is set";
    } else {
        return "failed to set date";
    }
}

export { validateTitle, validatePriority, validateDueDate };