const mongoose = require('mongoose');

const TrafficSchema = new mongoose.Schema({
    ip_address: {type: String, required: true}, 
    date: {type: String, required: true },
})
TrafficSchema.index( { ip_address: 1, date: 1}, { unique: true, dropDups: true} )

const Traffic = mongoose.model('Traffic', TrafficSchema)

module.exports = { Traffic }; 
