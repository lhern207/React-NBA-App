const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: 1
    },
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    poll: {
        type: String,
        required: true
    },
    count: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stats: {
        type: Array,
        required: true            
    }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = {Team};