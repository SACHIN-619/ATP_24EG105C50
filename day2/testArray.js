let testArray = [10,20,30]

//dynamic insertion
   // start
     testArray.push(40,50,60)
     console.log(testArray)
    //end
    testArray.unshift(1)

    console.log(testArray)


    
    testArray.splice(2,0,123)
    console.log(testArray)
//Dynanmic deletion
     //start
      let removedElement = testArray.shift()
      console.log(testArray)

      //end
      testArray.pop()
      console.log(testArray)
      
      //splice returns array of deleted element
      testArray.splice(2,2)
      console.log(testArray)

    //Dynamic update-dlete and add

  testArray.splice(2,1,2)
      