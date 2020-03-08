const mongoose = require('mongoose');
const config = require('../config.json');
const productSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    guild: {type: String, required: true},
    channel: {type: String, required: true},
    author: {type: String, required: true},
    command: {type: String, required: true},
    message: {type: String, required: true},
    date: {type:Date, required:true},
    version: {type:String, default:config.version},
    succeeded: {type:Boolean, default: false}
});
module.exports = mongoose.model('usage', productSchema);