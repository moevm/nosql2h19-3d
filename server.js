const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
let collection_name;

app.use(express.static(__dirname + "/public/"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");




app.get("/", (req, res) => {
    res.render("index.pug");
});

app.get("/collection_table", (req, res) => {
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

app.get('/requests', (req, res) => {
    res.render('requests.pug');
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


app.get('/testreq', (req,res) => {
    console.log(collection_name);
});

app.post('/save_chosen_collection_name', (req,res) => {
    console.log(req.body);
    collection_name = req.body.name;
    res.json({status: 'ok'});
});

app.post('/add-new-collection', (req, res) => {
    console.log(req.body)
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db("3DCloud");
        dbo.createCollection(req.body.name, function(err, result) {
            if(err) throw err;
            collection_name = req.body.name;
            console.log('Collection created');
            db.close();
        });
    });

    res.json({status: 'ok'})
});

app.post('/list_collections', (req, res) => {
    let arr = [];
    new Promise((resolve) => {
        MongoClient.connect(url,  (err, db) => {
            if (err) throw err;
            let dbo = db.db("3DCloud");
                dbo.listCollections().toArray( (err, collInfos) =>{
                    if (err) throw err;
                    db.close();
                    resolve(collInfos)
                });

        });
    }).then(data => {
        res.json(data);
    })
});

app.listen(port,  err => {
    if (err) throw err;
    else {

        console.log("Running server at port " + port);
    }
});
