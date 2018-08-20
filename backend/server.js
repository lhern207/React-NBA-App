//Importing core dependencies
const express = require('express');
const mongoose = require('mongoose');

//Importing Schema Models
const {Article} = require('./models/article');
const {Video} = require('./models/video');
const {Team} = require('./models/team');
const {User} = require('./models/user');

//Importing Middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
//Parse JSON body fields
app.use(bodyParser.json());
//Parse cookie fields
app.use(cookieParser());

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

app.post('/user/login', (req,res)=>{
    User.findOne({'email':req.body.email}, (err,user)=>{
        if(err){
            res.status(400).send(err);
        }
        else if(!user){
            res.status(400).send('Authentication failed, user not found');
        }
        else{
            user.comparePassword(req.body.password, (err,isMatch)=>{
                if(err) {
                    throw err;
                }
                else if(!isMatch){
                    res.status(400).send("Wrong password");
                }
                else{
                    user.generateToken((err, user)=>{
                        if(err){
                            res.status(400).send(err);
                        }
                        else{
                            res.cookie('auth', user.token).send('ok');
                        }
                    });
                }
            });
        }
    });
});

app.post('/user/register', (req,res)=> {
    User.findOne({'email':req.body.email}, (err,user)=>{
        if(err){
            res.status(400).send(err);
        }
        else if(user){
            res.status(400).send('An account with that email already exists');
        }
        else{
            const user = new User(
                {
                    email: req.body.email,
                    password: req.body.password,
                    token: ''
                }
            );
            //Generate token already saves the user. No need to do it again here.
            user.generateToken((err, user)=>{
                if(err){
                    res.status(400).send(err);
                }
                else{
                    res.cookie('auth', user.token).send('ok');
                }
            });
        }
    });
});

app.post('/user/logout', (req,res)=> {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user)=>{
        if(err || !user){
            console.log("Logout - Token for deletion not found");
        }
        else{
            user.token = '';
            user.save((err,user)=>{
                if(err) console.log("Logout - Token could not be deleted from database");
            });
        }
    });
    res.clearCookie('auth').send('ok');
});

//Server listen
const port = process.env.PORT || 3004;
app.listen(port, ()=>{
    console.log("Server started on port 3004");
});