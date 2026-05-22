mongodb is document based db
daatbase consite of doucument awhich is inside collection

data stores in doucment based
 inside server ->database->inside each dtabase ->create collection->inside each server we need to create  document


 mongodb commands :

    use DBname
    show dbs
    cls
    db.creteCollection("Users")

db.users.insertOne()//db.users.insertOne({name:"Sachin",age:20,city:"Hyderabad"})

when we create unique field --(so no need of providing pk from devlopers)

db.users.insertMany([{name:"Harshit",age:20,city:"Hyderabad"},{name:"Manasa",age:22,city:"Vizag"}])
------------------------------------------------------------------------------------------
to retreive data:
 
 db.collectionName.findOne() //first doc
 db.collectionName.find() //all doc without condn

Query operator:

db.collection-name.findOne({fieldename:{vlaue os obj like $eq:"sachin"}})

-------------------------------------------------------------------------
to update:
db.users.updateOne({name:"Sachin"},{$set:{name:"Sachin Kumar",age:19}})

db.users.updateOne({name:"Sachin"},{$set:{name:"Sachin Kumar",age:19}})



db.users.updateOne({name:"sachin"},{$push:{skills:{$each:["vue","nextjs"]}}})
------------------------------------------------------------------------------------------
to remove
db.users.updateOne({name:"sachin"},{$unset:{skills:""}})

db.users.find({skills:{$all:["html"]}})


db
-----------------------------------------------------------------------------
projection::
db.users.findOne({},{name:1})
o/p: 
  {
  _id: ObjectId('69a91bd816880655556683c9'),
  name: 'Sachin Kumar'
   }

db.users.findOne({},{name:1,_id:0})   

db.users.findOne({},{name:1,_id:0})