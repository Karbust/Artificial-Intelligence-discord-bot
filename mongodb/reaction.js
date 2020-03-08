const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    guild: {type:String, required:true},
    message: {type:String, required:true},
    reaction: {type:String, required:true},
    role: {type:String, required:true}
});
module.exports = mongoose.model('Reactions', productSchema);