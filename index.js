const express = require('express');
// const res = require('express/lib/response');
// const { json } = require('express/lib/response');
const app = express();

const portNumber = 3000;
app.use(express.json())
// var mongo = require('mongodb');



var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://mongo:27017/mongo-app/";
var url = "mongodb://localhost:27017/";

//search for a document
app.post('/index',(request, response)=>{

    MongoClient.connect(url, function(err, db) {
    if (err) throw err;

        var dbo = db.db("documents");

        dbo.collection("cloud-ca").insertOne(request.body, function(err, res) {
            if (err) throw err;
            console.log("Inserted!");
            db.close();
        });
    });

    response.send(request.body);

})

//search for a document
app.get('/search', (req, res) => {
     console.log(req.query.title)
    var theResponse;
    
    MongoClient.connect(url, function(err, db) {
        
        if (err) throw err;
            var dbo = db.db("documents");
            
            dbo.collection('cloud-ca').createIndex(
                {title: 'text'}
                
            )
        
            console.log('===========MATCHED DOCUMENTS============');

            dbo.collection("cloud-ca")
                .find({$text:{$search:req.query.title.toString()}}).toArray((err, data) => {
                if(err) throw err;

                theResponse = data
                
                console.log(theResponse); 
                res.send(data)
            
                db.close();

            });
        });
})


app.get('/document-slug', (request, response) => {
    console.log('get to /document-slug')
})

app.use((req, res) =>{
    res.status(404).send('404 Not Found');
})


app.listen(portNumber);