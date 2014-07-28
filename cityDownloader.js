var MongoDb = require("mongodb"),
MongoClient = MongoDb.MongoClient,
ObjectID = MongoDb.ObjectID,
fs = require("fs");

MongoClient.connect("mongodb://cityCam:mack@ds053449.mongolab.com:53449/photos", function (err, db) {

  if(err){
   throw err;
 }

 console.log("DB CONNECTED!!");

 db.collection('photos', function (error, collection) {
  if(error){
    throw error;
  }
  console.log("collection found");

  collection.find().toArray(function(err, results) {
    console.dir(results);

    results.forEach(function(result, index){
      fs.writeFile("./picFiles/"+"pic"+index+".jpg", result.image.buffer, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("The file was saved!");
        }
      }); 
    });

    db.close();
  });

});
});

