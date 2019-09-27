const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("MyDb");
    dbo.collection("Persons").find({}).toArray().then((docs)=>{
        console.log("All fields of Persons:");
        docs.forEach((doc) => {console.log(doc)})
    });

    dbo.listCollections().toArray().then((docs) => {

        console.log('Available collections:');
        docs.forEach((doc, idx, array) => { console.log(doc.name) });

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        db.close();
    });
});