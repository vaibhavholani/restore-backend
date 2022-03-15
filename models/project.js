const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    html_id: {type: String, required: true}, 
    title: {type: String, required: true },
    desc: {type: String, required: true},
    funder: {type: String, required: true},
    img: {type: 'Buffer', required: true}, 
    img_mimetype: {type: String, required: true},
    short_navbar_title: {type: String, required: true}
})

const Project = mongoose.model('Project', ProjectSchema)
module.exports = { Project }; 