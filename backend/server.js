//Importing core dependencies
const express = require('express');
const mongoose = require('mongoose');

//Importing Schema Models
const {Article} = require('./models/article');
const {Video} = require('./models/video');
const {Team} = require('./models/team');

//Importing Middleware
const {accessControl} = require('./middleware/headers');
const {determineQuery} = require('./middleware/general');

//Set-up Mongoose
const dev_db_url = 'mongodb://localhost:27017/nba-app';
mongoose.Promise = global.Promise;

//Connect to MongoDB database and create Express server instance.
mongoose.connect(process.env.MONGODB_URI || dev_db_url);
const app = express();

//MIDDLEWARE//
//Set access control headers
app.use(accessControl);
//Determine query type for GET requests
app.use(determineQuery);

//Routes//
app.get('/articles', (req,res)=>{
    req.query_action(Article, (err,result)=>{
        if(err){
            res.status(404).send("Unable to retrieve content");
        }
        else{
            res.status(200).send(result);
        }
    });
});

app.get('/videos', (req, res)=>{
    req.query_action(Video, (err,result)=>{
        if(err){
            res.status(404).send("Unable to retrieve content");
        }
        else{
            res.status(200).send(result);
        }
    });
});

app.get('/teams', (req,res)=>{
    req.query_action(Team, (err,result)=>{
        if(err){
            res.status(404).send("Unable to retrieve content");
        }
        else{
            res.status(200).send(result);
        }
    });
});

//Server listen
const port = process.env.PORT || 3004;
app.listen(port, ()=>{
    console.log("Server started on port 3004");
});