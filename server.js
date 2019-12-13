const express = require("express");
const data_model = require('./generate_collections');
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
let spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path')
let collection_name; var cube_size = 0;



app.use(express.static(__dirname + "/public/"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("index.pug");
});

app.get("/collection_table", (req, res) => {
  rf = JSON.parse(fs.readFileSync('./Data/Db_info/Db_info.json', "utf8"));
  console.log(rf);
  res.render("collection_table.pug");
});

app.get("/completed", (req, res) => {
    res.render("completed.pug");
});

app.get("/stats", (req, res) => {
    res.render("stats.pug");
});

app.get("/file_name_for_new_collection", (req, res) => {
    res.render("file_name_for_new_collection.pug");
});

app.get('/choose_collection', (req, res) => {
    res.render('choose_collection.pug');
});

app.get('/export', (req, res) => {
    res.render('export.pug');
});

app.post('/first_request', (req, res) => {
  var number = req.body.numb;
  res.render('first_request.pug', {"number": ' ' + number + ' точек'});
});

app.post('/second_request', (req, res) => {
  var number = req.body.numb2;
  res.render('second_request.pug', {"number": ' ' + number + ' точек'});
});

app.post('/third_request', (req, res) => {
  var number = req.body.numb1;
  var coord = req.body.coords;
  res.render('third_request.pug', {"number": ' ' + number + ' точек', "coordinates": coord});
});


app.post('/requests', (req, res) => {
  var new_collection;
  [new_collection, cube_size] = data_model.form_data_model(req.body.rabbit); // Здесь сформированная коллекция
  let file_dir = './Data/' + collection_name + '.json';
  var col_info = {
    "collection_name": fs.readFileSync('./Data/Db_info/currcoll.txt', "utf8"),
    "cube_size": cube_size
  }
  var c_save = fs.writeFileSync('./Data/Db_info/Db_info.json', JSON.stringify(col_info));
  var st = fs.writeFileSync(file_dir, JSON.stringify(new_collection)); // И в этом файле тоже
  res.render('requests.pug');
});


app.post('/get_stats', (req,res) => {
    new Promise((resolve, reject) => {
        MongoClient.connect(url,  (err, db) => {
            if (err) throw err;
            var result = {
              cubesize: JSON.parse(fs.readFileSync('./Data/Db_info/Db_info.json', 'utf8')).cube_size
            };
            let dbo = db.db(`${req.body.name}`);
            dbo.collection('Points').countDocuments({}, (err, data) =>{
                if (err) throw err;
                result.points = data;
            });
            dbo.collection('Cubes').countDocuments({}, (err, data) =>{
                if (err) throw err;
                result.cubes = data;
                resolve(result);
            });
        });
    }).then(result => {
        res.json(result);
    })
});
app.get('/requests1', (req, res) => {
    res.render('requests1.pug');
});

app.post('/insert_collection', (req, res) => {
    collection_name = fs.readFileSync('./Data/Db_info/currcoll.txt', "utf8");
    let file_dir = './Data/' + collection_name + '.json';
    let new_collection = fs.readFileSync(file_dir, "utf8");
    let translated = JSON.parse(new_collection);
    new Promise((resolve) => {
        MongoClient.connect(url,  (err, db) => {
            if (err) throw err;
            let dbo = db.db(`${collection_name}`);
            dbo.collection('Points').insertMany(translated.Points.all_points, (err, data) =>{
                if (err) throw err;
            });
            dbo.collection('Cubes').insertMany(translated.Cubes.all_cubes, (err, data) =>{
                if (err) throw err;
                resolve(data);
            });

        });
    }).then(data => {
        res.json(data);
    })
});


app.get('/load_new_collection', (req, res) => {
    res.render('load_new_collection.pug');
});


app.get("/import", (req, res) => {
    res.render("import.pug");
});

app.get("/coll_chosen", (req,res) => {
    res.render('requests.pug');
});

app.post('/save_chosen_collection_name', (req,res) => {
    console.log(req.body);
    collection_name = req.body.name;
    try { fs.unlinkSync('./Data/Db_info/currcoll.txt');} catch(e) {console.log('error');}
    var st2 = fs.writeFileSync('./Data/Db_info/currcoll.txt', collection_name);
    res.json({status: 'ok'});
});

app.post('/db_first_request', (req, res) => {
    var n = Number.parseInt(req.body.name);
    collection_name = fs.readFileSync('./Data/Db_info/currcoll.txt', "utf8");
    let file_dir = './Data/' + collection_name + '.json';
    let new_collection = fs.readFileSync(file_dir, "utf8");
    let translated = JSON.parse(new_collection);
    new Promise((resolve) => {
        MongoClient.connect(url,  (err, db) => {
            if (err) throw err;
            let dbo = db.db(`${collection_name}`);
            // здесь тело запроса к БД
            dbo.collection('Points').aggregate([
              { $group: {
                _id: "$Cube_id" ,
                count: { $sum: 1 }
              } },
              { $match: {
                count: { $lt: n }
              } },
            ], function (err, cursor) {
              if (err) throw err;
              cursor.toArray(function(err, documents) {
                resolve(documents)
              });
            });
        });
    }).then(data => {
        res.json(data);
    })
});


app.post('/db_second_request', (req, res) => {
    var n = Number.parseInt(req.body.name);
    collection_name = fs.readFileSync('./Data/Db_info/currcoll.txt', "utf8");
    let file_dir = './Data/' + collection_name + '.json';
    let new_collection = fs.readFileSync(file_dir, "utf8");
    let translated = JSON.parse(new_collection);
    new Promise((resolve) => {
        MongoClient.connect(url,  (err, db) => {
            if (err) throw err;
            let dbo = db.db(`${collection_name}`);
            // здесь тело запроса к БД

            dbo.collection('Points').aggregate([
              { $group: {
                _id: "$Cube_id" ,
                coordinates: { $first: {
            		x: "$Cube_x",
            		y: "$Cube_y",
            		z: "$Cube_z" } },
                count: { $sum: 1 }
              } },
              { $match: {
                count: { $gte: n }
              } },
            ], function (err, cursor) {
              if (err) throw err;
              cursor.toArray(function(err, documents) {
                resolve(documents)
              });
            });
        });
    }).then(data => {
        res.json(data);
    })
});



app.post('/db_third_request', (req, res) => {
    var n = Number.parseInt(req.body.numb);
    [X, Y, Z] = [ Number.parseFloat(req.body.coords.split(',')[0]), Number.parseFloat(req.body.coords.split(',')[1]), Number.parseFloat(req.body.coords.split(',')[2]) ];
    collection_name = fs.readFileSync('./Data/Db_info/currcoll.txt', "utf8");
    let file_dir = './Data/' + collection_name + '.json';
    let new_collection = fs.readFileSync(file_dir, "utf8");
    let translated = JSON.parse(new_collection);
    new Promise((resolve) => {
        MongoClient.connect(url,  (err, db) => {
            if (err) throw err;
            let dbo = db.db(`${collection_name}`);
            // здесь тело запроса к БД

            db.collection('Points').aggregate([
              { $project: {
                 x: "$x",
                 y:"$y",
                 z:"$z",
                 distance: { $sqrt:
            		{$add: [
            			{$pow: [{$subtract: ["$x", X ] },2]},
            			{$pow: [{$subtract: ["$y", Y ] },2]},
            			{$pow: [{$subtract: ["$z", Z ] },2]},
            ]}}
            }},
            {$match:{distance:{$ne:0}}},
            {$sort:{distance:1}},
            {$limit:n},
            {$skip:n-1}
            ]).pretty(), function (err, cursor) {
              if (err) throw err;
              cursor.toArray(function(err, documents) {
                resolve(documents)
              });
            });
        });
    }).then(data => {
        res.json(data);
    })
});

app.post('/add-new-collection', (req, res) => {
    collection_name = req.body.name;
    try { fs.unlinkSync('./Data/Db_info/currcoll.txt');} catch(e) {console.log('error');}
    var st2 = fs.writeFileSync('./Data/Db_info/currcoll.txt', collection_name);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db(`${req.body.name}`);
        dbo.createCollection("Points", function(err, result) {
            if(err) throw err;
            console.log('Collection created');
        });
        dbo.createCollection("Cubes", function(err, result) {
            if(err) throw err;
            console.log('Collection created');
            db.close();
        });

    });

    res.json({name: collection_name});
});

app.post('/export_dbase', (req, res) => {
    console.log(req.body)
    let child = spawn("C:/Program Files/MongoDB/Server/4.2/bin/mongodump", ['--db', '3DCloud', '--out', `${req.body.name}`]);
    child.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    child.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
    res.json({status: 'ok'});
});

app.post('/import_dbase', (req, res) => {
    console.log(req.body)
    let child = spawn("C:/Program Files/MongoDB/Server/4.2/bin/mongorestore", [`${req.body.name}`]);
    child.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    child.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
    res.json({status: 'ok'});
});



app.post('/list_collections', (req, res) => {
    let arr = [];
    new Promise((resolve) => {
        MongoClient.connect(url,  (err, db) => {
            if (err) throw err;
            let dbo = db.db("admin").admin();
                dbo.listDatabases( (err, collInfos) =>{
                    if (err) throw err;
                    let res = [];
                    console.log(collInfos.databases);
                    for(let i = 0; i < collInfos.databases.length;i++)
                    {
                        res[i] = collInfos.databases[i].name;
                    }
                    db.close();
                    resolve(res);
                });

        });
    }).then(data => {
        res.json(data);
    })
});


app.post("/acquire_collection_name", (req, res) => {
  collection_name = fs.readFileSync('./Data/Db_info/currcoll.txt', "utf8");
  res.json({name: `${collection_name}`});
});

app.listen(port,  err => {
    if (err) throw err;
    else {

        console.log("Running server at port " + port);
    }
});
