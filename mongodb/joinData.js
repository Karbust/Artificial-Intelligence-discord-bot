const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId, required: true},
	guild: {type: String, required: true},
	date: {type: Date, required: true},
	membercount: {type: Number, required: true}
});
module.exports = mongoose.model('JoinData', productSchema);
