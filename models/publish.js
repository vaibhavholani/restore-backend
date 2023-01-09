const mongoose = require('mongoose');

const PublishSchema = new mongoose.Schema({
    heading: {type: String, required: true}, 
    text: {type: String, required: true },
})

const Publication = mongoose.model('Publication', PublishSchema)

module.exports = { Publication }; 

