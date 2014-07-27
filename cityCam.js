var RaspiCam = require("raspicam");
var MongoDb = require("mongodb"),
    ObjectID = MongoDb.ObjectID,
    db = new MongoDb.Db("test", new MongoDb.Server("192.168.1.132", 27017, {auto_reconnect: true}, {})),
    fs = require("fs");

db.open(function (err, db) {
  console.log("DB CONNECTED!!");
});

var camera = new RaspiCam({
  mode: "timelapse",
  output: "./timelapse/image_%06d.jpg", // image_000001.jpg, image_000002.jpg,...
  encoding: "jpg",
  timelapse: 60000, // take a picture every 60 seconds
  timeout: 86400000 // take a total over 24 hours, in seconds 
});

camera.on("start", function( err, timestamp ){
  console.log("timelapse started at " + timestamp);
});

camera.on("read", function( err, timestamp, filename ){
  console.log("timelapse image captured with filename: " + filename);
  var input = {};
  if(process.argv.length > 2){
    input.name = process.argv[2];
  }

  input.date = timestamp;

  var data = fs.readFileSync(filename);
  input.image = new MongoDb.Binary(data);
  input.imageType = 'jpeg';

  db.collection('photos', function (error, collection) {
    collection.save(input, {safe: true}, function (err, objects) {
      if (err) {
        res.json(error, 400);
      } else if (objects === 1) {     //update
      } else {                        //insert
      }
    });
  });
});

camera.on("exit", function( timestamp ){
  console.log("timelapse child process has exited");
});

camera.on("stop", function( err, timestamp ){
  console.log("timelapse child process has been stopped at " + timestamp);
});

camera.start();

// test stop() method before the full 12 seconds is up
// setTimeout(function(){
//  camera.stop();
//  }, 10000);
