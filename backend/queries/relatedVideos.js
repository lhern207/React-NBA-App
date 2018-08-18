const relatedVideos = (dbModel, tagValue, limit, cb) => {
    let query = dbModel.find({tags:tagValue}).limit(limit);
    query.exec((err, documents)=>{
        if(err){
            return cb(err);
        }
        cb(null, documents);
    });
};

module.exports = {relatedVideos};