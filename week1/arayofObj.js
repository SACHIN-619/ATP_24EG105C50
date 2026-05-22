

let student = {
    firstname:'Sachin',
    lastname:' Kiran',
    marks:[67,89,99,67],
    fullName:sname=function(){
       return (firstname+lastname)
    },
    AverageMarks:amarks=function(){
        let avg
        for(let v in marks){
            avg = marks[v]

        }
        return avg
    }
}



// console.log(student.fullName)

for(let v in student){
    console.log(student)
}