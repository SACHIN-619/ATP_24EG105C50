//fetch and then
//using async and await
//way to consume promise async and await is modern syntax 
async function getData(){
    try{
        let res = await fetch("https://jsonplaceholder.typicode")
        let data = await res.json();
        console.log(data);
    }
    catch(err){
        console.log(err)
    }
}