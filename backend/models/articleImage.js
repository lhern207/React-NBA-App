const mongoose = require('mongoose');

const articleImageSchema = mongoose.Schema({
    source: {
        type: String,
        required: true
    }
},{collection: 'articleImages'});

articleImageSchema.statics.storeImage = function(imageSource, cb){
    const articleImage = this;
    const newImage = new articleImage(
        {
            source : imageSource
        }
    );
    newImage.save((err,image)=>{
        if(err) return cb(err);
        cb(null, image);
    });
};

const articleImage = mongoose.model('articleImage', articleImageSchema, 'articleImages');

module.exports = {articleImage};