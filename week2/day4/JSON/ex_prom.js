//example of promiseses
//Make PAI request
fetch('https://jsonplaceholder.typicode.com/posts')
.then(res=>res.json()) //it consumer prom of fetch
.then(postsData=>console.log(postsData))//it consume prom of json
.catch(err=>console.log('err is ',err))

//Hassh a possword
//creating tokens
//database /HTTP libreares
//file & Stream APILs