// //object literal
// const test = {
//     a:10,
//     getData:function(){

//     }
// }

//create 20 studeent objects

class Student{
    //propertires
    #sno;  // # makes a variable private access only by class
    name;
    email;

    //constructor  //excute by obj init
    //methods  //only excuted when invoed

    constructor(sno,name,email){
        //initialize the object
        this.#sno=sno;  //W
        this.name=name;
        this.email=email;

    }

    //methods
    getStudentData(){
        return this.name;
    }

}
//calling a class means call ing constructor method
let std1 = new Student(18,'Sachin','Sachin@gmail.com')
let std2 = new Student(20,'Sathvik','Sathvik@gmail.com')

console.log(std1.name)