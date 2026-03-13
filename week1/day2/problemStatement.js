const employees = [
  {
    eno: 101,
    name: "Ravi",
    marks: [78, 82, 91],
  },
  {
    eno: 102,
    name: "Bhanu",
    marks: [65, 70, 68],
  },
  {
    eno: 103,
    name: "Sneha",
    marks: [88, 92, 95],
  },
  {
    eno: 104,
    name: "Kiran",
    marks: [55, 60, 58],
  },
  {
    eno: 105,
    name: "Anitha",
    marks: [90, 85, 87],
  },
];




// Insert new Emp at 2nd position
// Remove an emp with name "Kiran"
// 3.Change the last mark 95 to 75 of emp  "Sneha"




employees.splice(1,0,{eno:100,name:"Sachin",marks:[90,99,100]})
console.log(employees)
// employees.splice(5,1,0)

// let removed
for(let i of employees){
    if(i.name=='Kiran'){
        employees.splice(employees.indexOf(i),1)
    }
}
console.log(employees)
for(let i of employees){
    if(i.name=='Sneha'){
        // employees.splice(employees.indexOf(i),0,marks[2]=100)
        i.marks.splice(2,1,75)
    }
}
console.log(employees)

