const retrieveRange = (dbModel, start, end, cb) => {
    dbModel.find({id:{$gte: start, $lte: end}}, (err,documents)=>{
        if(err){
            return cb(err);
        }
        cb(null, documents);
    });
};

const retrieveById = (dbModel, documentID, cb) => {
    dbModel.findOne({'id':documentID}, (err, document)=>{
        if(err){
            return cb(err);
        }
        cb(null, document);
    });
};

const retrieveAll = (dbModel, cb) => {
    dbModel.find((err,documents)=>{
        if(err){
            return cb(err);
        }
        cb(null, documents);
    });
};

module.exports = {
    genQueries : {
        retrieveRange,
        retrieveById,
        retrieveAll
    }
};