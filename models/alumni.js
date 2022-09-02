const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({ 
    name: {type: String, required: true}, 
    img: {type: 'Buffer', required: true}, 
    img_mimetype: {type: String, required: true}, 
    title: {type: String, required: true },
    duration : {type: String, required: true },
    description: {type: String, required: true},
    linkedin: {type: String, required: false},
    email: {type: String, required: false},
    website: {type: String, required: false},
    type: {type: String, required: true}
})

const Alumni = mongoose.model('AlumniSchema', AlumniSchema)

module.exports = { Alumni }; 
