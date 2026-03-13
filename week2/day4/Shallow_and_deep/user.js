const user = {
    id: 101,
    name: "Ravi",
    preferences: {
        theme: "dark",
        language: "en"
    }
};


const userCopy = {...user}
userCopy.id=102
userCopy.preferences.theme="Red"
userCopy.preferences.language="hi"
user.preferences.language="tn"

console.log(user)
console.log(userCopy)
