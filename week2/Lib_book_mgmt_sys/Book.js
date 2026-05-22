class Book {
    constructor(title, author, pages, isAvailable) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isAvailable = isAvailable;
    }

    borrow() {
        if (this.isAvailable) {
            this.isAvailable = false;
            return "Book Borrowed";
        }
        return "Not Available";
    }

    returnBook() {
        this.isAvailable = true;
        return `Title ${this.title} Author ${this.author} Pages ${this.pages} isAvailable ${this.isAvailable}`;
    }

    getInfo() {
        return `Title ${this.title} Author ${this.author} Pages ${this.pages} isAvailable ${this.isAvailable}`;
    }

    isLongBook() {
        return this.pages > 300;
    }
}

let b1 = new Book('C Programming', 'Denish', 325, true);

console.log(b1.getInfo());

// class Book{
//     title
//     author
//     pages
//     isAvailable


//     constructor(title,author,pages,isAvailable){
//         this.title=title
//         this.autor=author
//         this.pages=pages
//         this.isAvailable
//     }
//     borrow(title){
//       return 'Exist'
//     }

//     returnBook(){
//         return `Title ${title} Author ${author} pages ${pages} isAvailabel ${this.isAvailable}`
//     }

//     getInfo(){
//         return `Author ${author} pages ${pages} isAvailabel ${this.isAvailable} `
//     }

//     isLongBook(title){
//         return `true`
//     }


// }

// let b1 = Book('c','denish',325,true)