//Importing core dependencies
const express = require('express');
const mongoose = require('mongoose').set('debug', true);

//Importing Schema Models
const {Article} = require('./models/article');
const {Video} = require('./models/video');
const {Team} = require('./models/team');
const {User} = require('./models/user');
const {articleImage} = require('./models/articleImage');
const {videoImage} = require('./models/videoImage');

//Importing Middleware
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {accessControl} = require('./middleware/headers');
const {determineQuery} = require('./middleware/general');
const {auth} = require('./middleware/auth');

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
app.use(bodyParser.json({limit: '10mb'}));
//Parse cookie fields
app.use(cookieParser());

//Routes//
app.get('/articles', (req,res)=>{
    req.query_action(Article, (err,articles)=>{
        if(err) return res.status(404).send("Unable to retrieve content");
        //Resolve articles images in same request.Attach image to corresponding article object
        //If query returns multiple articles
        if(Array.isArray(articles)){
            let requests = articles.map((article)=>{
                return new Promise((resolve) => {
                    articleImage.findById(article.image, (err, theImage)=>{
                        if(err) return res.status(400).send(err);
                        article.image = theImage.source;
                        resolve(article);
                    });
                });
            });
            Promise.all(requests).then(m_articles=>res.status(200).send(m_articles));
        }
        else {
            //If query returns single article
            //Keep in mind in this case articles is really just one article
            articleImage.findById(articles.image, (err, image)=>{
                if(err) return res.status(400).send(err);
                articles.image = image.source;
                res.status(200).send(articles);
            });
        }
    });
});

//Needs Auth
app.post('/articles', (req,res)=>{
    //Store image
    const imageSource = req.body.image;
    let imageID = '';
    let newID = null;
    
    //Store image
    let imageStore = new Promise((resolve) => {
        articleImage.storeImage(imageSource, (err,image)=>{
            if(err) return res.status(400).send(err);
            imageID = image._id;
            resolve();
        });
    });

    //Find last article
    let articleStore = new Promise((resolve) => {
        Article.findByMaxId((err,article)=>{
            if(err) return res.status(400).send(err);
            newID = article.id + 1;
            resolve();
        });
    });

    //Get formatted date. This should be middleware
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    const currentDate = month + '/' + day + '/' + year;

    //Once all async actions are done. Create an article.
    Promise.all([imageStore, articleStore]).then(()=>{
        const newArticle = new Article(
            {
                id: newID,
                team: req.body.team,
                title: req.body.title,
                image: imageID,
                body: req.body.body,
                date: currentDate,
                author: req.body.author,
                tags: []
            }
        );

        newArticle.save((err,article)=>{
            if(err) return res.status(400).send(err);
            res.status(200).send({"article":newID});
        });
    })
});

//Needs Auth
app.post('/dashboard', (req,res)=>{
    res.status(200).send('ok');
});

app.get('/videos', (req, res)=>{
    req.query_action(Video, (err,videos)=>{
        if(err) return res.status(404).send("Unable to retrieve content");
        //Resolve articles images in same request.Attach image to corresponding article object
        //If query returns multiple articles
        if(Array.isArray(videos)){
            let requests = videos.map((video, i)=>{
                return new Promise((resolve) => {
                    videoImage.findById(video.image, (err, theImage)=>{
                        if(err) return res.status(400).send(err);
                        video.image = theImage.source;
                        resolve(video);
                    });
                });
            });
            Promise.all(requests).then(m_videos=>res.status(200).send(m_videos));
        }
        else {
            //If query returns single article
            //Keep in mind in this case articles is really just one article
            videoImage.findById(videos.image, (err, theImage)=>{
                if(err) return res.status(400).send(err);
                videos.image = theImage.source;
                res.status(200).send(videos);
            });
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
            const newUser = new User(
                {
                    email: req.body.email,
                    password: req.body.password,
                    token: ''
                }
            );
            //Generate token already saves the user. No need to do it again here.
            newUser.generateToken((err, user)=>{
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
            res.send(status).send("Logout - Token for deletion not found");
        }
        else{
            user.token = '';
            user.save((err,user)=>{
                if(err) res.status(200).send("Logout - Token could not be deleted from database");
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