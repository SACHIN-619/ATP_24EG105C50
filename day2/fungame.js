

let createGames=function(nameofPlayers){
    return function(Createlevel){
    console.log(`Hello ${nameofPlayers}, You are at Createlevel ${Createlevel} `)
        
    }
}

Createlevel=createGames("Sachin")
Createlevel(1)
Createlevel('last')