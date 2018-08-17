const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
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

const Video = mongoose.model('Video', videoSchema);

module.exports = {Video};