class Employee{
    //private members
    #eno;
    #name;

    //constructor
    constructor(eno,name){
                this.#eno=eno;
                this.#name=name;
    }

    getData(){
        console.log(`eno is ${this.#eno} and name is ${this.#name}`)
    }
}

const emp=new Employee(100,'sachin')

// console.log(emp.#eno)  // private valiabe cannot be accessed outside the claass