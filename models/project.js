const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    html_id: {type: String, required: true}, 
    title: {type: String, required: true },
    desc: {type: String, required: true},
    funder: {type: String, required: true},
    img: {type: 'Buffer', required: true}, 
    img_mimetype: {type: String, required: true},
    short_navbar_title: {type: String, required: true},
    displayButton: {type: String, required: false, default: "False"},
    buttonText: {type: String, required: false, default: ""},
    buttonType: {type: String, required: false, default: ""},
    buttonLink: {type: String, required: false, default: ""},
    buttonDownload: {type: 'Buffer', required: false,},
    download_mimetype: {type: String, required: false}
})

const Project = mongoose.model('Project', ProjectSchema)
module.exports = { Project }; 