const mongoose = require('mongoose');

const bannerGeneralSchema = new mongoose.Schema({
    background: {type: String, required: true},
    orientation: {type: String, required: true}
})

const bannerTextSchema = new mongoose.Schema({
    text: {type: String, required: true},
    color: {type: String, required: true},
    fontSize: {type: String, required: true},
    display: {type: Boolean, required: true},
});

const bannerButtonSchema = new mongoose.Schema({
    text: {type: String, required: true},
    color: {type: String, required: true},
    background: {type: String, required: true},
    redirect: {type: String, required: true},
    display: {type: Boolean, required: true},
});

const BannerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    general: {type: bannerGeneralSchema, required: true}, 
    heading: {type: bannerTextSchema, required: true },
    subHeading: {type: bannerTextSchema, required: true},
    button: {type: bannerButtonSchema, required: true},
    img: {type: 'Buffer', required: true}, 
    img_mimetype: {type: String, required: true},
})

const Banner = mongoose.model('Banner', BannerSchema)
module.exports = { Banner }; 