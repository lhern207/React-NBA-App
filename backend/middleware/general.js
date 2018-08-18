const {genQueries} = require('../queries/general');
const {relatedVideos} = require('../queries/relatedVideos');

const determineQuery = (req, res, next) => {
    if(req.query.id){
        const documentID = parseInt(req.query.id);
        req.query_action = (dbModel,cb) => genQueries.retrieveById(dbModel,documentID,cb);
    }
    else if(req.query._start && req.query._end){
        const start = parseInt(req.query._start);
        const end = parseInt(req.query._end);
        req.query_action = (dbModel,cb) => genQueries.retrieveRange(dbModel,start,end,cb);
    }
    else if(req.query.tag && req.query._limit){
        const tagValue = req.query.tag;
        const limit = parseInt(req.query._limit);
        req.query_action = (dbModel,cb) => relatedVideos(dbModel,tagValue,limit,cb);
    }
    else{
        req.query_action = (dbModel,cb) => genQueries.retrieveAll(dbModel,cb);
    }
    next();
};

module.exports = {determineQuery};