/*ASSIGNMENT 2:
-------------
Student Performance Dashboard

You are working on a college result analysis system.

Test Data:
const students = [
  { id: 1, name: "Ravi", marks: 78 },
  { id: 2, name: "Anjali", marks: 92 },
  { id: 3, name: "Kiran", marks: 35 },
  { id: 4, name: "Sneha", marks: 88 },
  { id: 5, name: "Arjun", marks: 40 }
];

Tasks:
    1. filter() students who passed (marks ≥ 40)
    2. map() to add a grade field
              ≥90 → A
              ≥75 → B
              ≥60 → C
              else → D

   3. reduce() to calculate average marks
   4. find() the student who scored 92
   5. findIndex() of student "Kiran"  */



const students = [
    { id: 1, name: "Ravi", marks: 78 },
    { id: 2, name: "Anjali", marks: 92 },
    { id: 3, name: "Kiran", marks: 35 },
    { id: 4, name: "Sneha", marks: 88 },
    { id: 5, name: "Arjun", marks: 40 }
];

let s1 = students.filter(m => (m.marks >= 40))
console.log(s1)

let s2 = students.map(m=>function(m){
    let grade
    if(m.marks > 90){
        m.grade = "A"
    }
if (m.marks > 75) {
    m.grade = "B"
}
if (m.marks > 60) {
    m.grade = "C"
}
else {
    m.grade = "fail"
}


return  {
    id :m.id,
    name :m.name,
    marks :m.marks,
    grade:m.grade
}
})

console.log(s2)