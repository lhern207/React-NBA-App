const mongoose = require('mongoose');

const videoImageSchema = mongoose.Schema({
    source: {
        type: String,
        required: true
    }
},{collection: 'videoImages'});

videoImageSchema.statics.storeImage = function(imageSource, cb){
    const videoImage = this;
    const newImage = new videoImage(
        {
            source : imageSource
        }
    );
    newImage.save((err,image)=>{
        if(err) return cb(err);
        cb(null, image);
    });
};

const videoImage = mongoose.model('videoImage', videoImageSchema, 'videoImages');

module.exports = {videoImage};