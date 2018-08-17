//Importing core dependencies
const express = require('express');
const mongoose = require('mongoose');

//Importing Schema Models
const {Article} = require('./models/article');
const {Video} = require('./models/video');
const {Team} = require('./models/team');

const dev_db_url = 'mongodb://localhost:27017/nba-app';
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || dev_db_url);

//Middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
});

//Routes//
app.get('/articles', (req, res)=>{
    if(req.query._start === undefined || req.query._end === undefined){
        res.status(400).send("Invalid Request Format");
    }
    start = parseInt(req.query._start);
    end = parseInt(req.query._end);

    Article.find({id:{$gte: start, $lte: end}}, (err,articles)=>{
        if(err){
            res.status(404).send("Unable to retrieve articles");
        }
        res.status(200).send(articles);
    });
});

app.get('/videos', (req, res)=>{

});

app.get('/teams', (req,res)=>{
    Team.find((err,teams)=>{
        if(err){
            res.status(404).send("Unable to retrieve teams");
        }
        res.status(200).send(teams);
    });
});

//Server listen
const port = process.env.PORT || 3004;
app.listen(port, ()=>{
    console.log("Server started on port 3004");
});