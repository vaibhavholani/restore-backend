const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    html_id: {type: String, required: true}, 
    title: {type: String, required: true },
    name: {type: String, required: true}, 
    description: {type: String, required: true},
    img: {type: 'Buffer', required: true}, 
    img_mimetype: {type: String, required: true}, 
    type: {type: String, required: true}
})

const Team = mongoose.model('Team', TeamSchema)

module.exports = { Team }; 
