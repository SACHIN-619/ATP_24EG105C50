function validateTitle(title) {
    if (!title) {
        return "title required"
    }
    if (len(title) > 3) {
        return "pass"
    }
    else {
        return "fail to create title"
    }
}

function validatePriority(priority) {
    if (priority == "low" && priority == "medium" && priority == "high") {
        return "set"
    }
    else {
        return "failed to set priority"
    }
}

function validateDueDate(date) {
    if (date > '25-feb-2026') {
        return "date is set"
    }
    else {
        return "failed to set date"
    }
}

export { validateTitle, validatePriority, validateDueDate }