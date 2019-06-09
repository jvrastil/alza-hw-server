var cors = require('cors');
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function () {
 console.log("Started on PORT 3000");
})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
 if (err) throw err;
 var dbo = db.db("mydb");
 // create collection
 dbo.collection("heroes").deleteMany({});

 dbo.createCollection("heroes", function (err, res) {
  if (err) throw err;
  console.log("Collection of heroes created!");
 });
 // create initial data
 const heroes = [
  {
   id: 0,
   name: 'Superman'
  },
  {
   id: 1,
   name: 'Thor'
  },
  {
   id: 2,
   name: 'Odin'
  },
  {
   id: 3,
   name: 'Magneto'
  },
  {
   id: 4,
   name: 'Spider-Man'
  },
  {
   id: 5,
   name: 'John Cena'
  },
  {
   id: 6,
   name: 'Big Lebovski'
  },
  {
   id: 7,
   name: 'Mr. Bean'
  }
 ];
 dbo.collection("heroes").insertMany(heroes, function (err, res) {
  if (err) throw err;
  db.close();
 });

});

MongoClient.connect(url, function (err, db) {
 if (err) throw err;
 var dbo = db.db("mydb");
 // create collection
 dbo.collection("favouriteHeroes").deleteMany({});

 dbo.createCollection("favouriteHeroes", function (err, res) {
  if (err) throw err;
  console.log("Collection of favourite heroes created!");
  db.close();
 });
});

app.get('/getHeroes', function (req, res) {
 console.log('Get Heroes');
 MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");

  var query = {};
  dbo.collection("heroes").find(query).toArray(function (err, result) {
   if (err) throw err;
   res.send(result);
   db.close();
  });
 });
});

app.put('/updateHero', function (req, res) {
 console.log('Update Hero');
 MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");

  var query = {id: req.body.id};
  const updatedHero = {
   id: req.body.id,
   name: req.body.name
  };
  dbo.collection("heroes").updateOne(query, updatedHero, function (err) {
   if (err) throw err;
   res.send(updatedHero);
   db.close();
  })
 });
});

app.post('/addHero', function (req, res) {
 console.log('Add Hero');
 MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");

  const newHero = {
   id: req.body.id,
   name: req.body.name
  };
  dbo.collection("heroes").insertOne(newHero, function (err) {
   if (err) throw err;
   res.send(newHero);
   db.close();
  })
 });
});

app.post('/deleteHero', function (req, res) {
 console.log('Delete Hero');
 MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  const query = { id: req.body.id };
  dbo.collection("heroes").deleteOne(query, function (err) {
   if (err) throw err;
   res.end();
   db.close();
  })
 });
});

app.get('/getFavouriteHeroes', function (req, res) {
 console.log('Get Favourite Heroes');
 MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");

  var query = {id: 0};
  dbo.collection("favouriteHeroes").find(query).toArray(function (err, result) {
   if (err) throw err;
   if (result && result[0])
    res.send(result[0].heroIds);
   else
    res.end();

   db.close();
  });
 });
});

app.post('/setFavouriteHeroes', function (req, res) {
 console.log('Set Favourite Heroes');
 MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");

  dbo.collection("favouriteHeroes").deleteMany({});
  dbo.collection("favouriteHeroes").insertOne({id: 0, heroIds: req.body.heroIds}, function (err) {
   if (err) throw err;
   res.send(req.body.heroIds);
   db.close();
  });
 });
});
