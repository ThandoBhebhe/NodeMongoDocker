const express = require('express');
// const res = require('express/lib/response');
// const { json } = require('express/lib/response');
const app = express();
let stopWord = require('stopword')

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
    console.log(req.query.words)
    if(req.query.words === undefined) res.send('You need to specify some words')


    //manually removing stop words.
    //I dont need to remove stop words manually as MongoDB does this automatically, but I did this just for demonstration.
    //Stop words list can be found here https://github.com/Mickael-van-der-Beek/mongo/commit/d4b38917b2314403642176c2ad6253a84b4e4c9f
    
    let oldString = req.query.words.trim().split(' ')
    let removedStopWords = stopWord.removeStopwords(oldString)
    console.log('==================')
    console.log(removedStopWords)
    console.log(removedStopWords.toString)
    
    var theResponse;
    
    MongoClient.connect(url, function(err, db) {
        
        
        if (err) throw res.send('Could not connect to server: ' + err.message);
            var dbo = db.db("documents");
            
            dbo.collection('cloud-ca').createIndex(
                {title: 'text', body: 'text'}
                
            )
        
            console.log('===========MATCHED DOCUMENTS============');

            dbo.collection("cloud-ca")
                .find({$text:{$search:req.query.words.toString()}}).toArray((err, data) => {
                if(err) throw err;

                theResponse = data
                
                console.log(theResponse); 
                res.send(data)
            
                db.close();

            });
    });
})

//return the mathching documents given its slugs
app.get('/document-slug', (req, res) => {

    let stringWithRemovedNumbers = req.query.words.replace(/[0-9]/g, '')
    let stringWithRemovedHyphens = stringWithRemovedNumbers.replace(/-/g, ' ').trim()
    let stringWithRemovedStopWords = stopWord.removeStopwords(stringWithRemovedHyphens.split(' ')).toString().replace(/,/g," ")


    console.log(`unslugged-word: ${stringWithRemovedStopWords}`)
    MongoClient.connect(url, function(err, db) {
        
        if (err) throw res.send('Could not connect to server: ' + err.message);
            var dbo = db.db("documents");
            
            dbo.collection('cloud-ca').createIndex(
                {title: 'text', body:'text'}
                
            )
        
            console.log('===========MATCHED DOCUMENTS============');

            dbo.collection("cloud-ca")
                .find({$text:{$search: stringWithRemovedHyphens}}).toArray((err, data) => {
                if(err) throw err;

                theResponse = data
                
                console.log(theResponse); 
                res.send(data)
            
                db.close();

            });
    });


})

app.use((req, res) =>{
    res.status(404).send('404 Not Found');
})


app.listen(portNumber);