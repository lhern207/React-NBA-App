const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: 1
    },
    team: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true            
    }
});

articleSchema.statics.findByMaxId = function(cb){
    const Article = this;
    Article.findOne({}).sort({'id':-1}).limit(1).exec((err,article)=>{
        if(err){
            return cb(err);
        }
        if(!article){
            return cb(null, {id:0})
        }
        cb(null, article);
    })
};

const Article = mongoose.model('Article', articleSchema);

module.exports = {Article};