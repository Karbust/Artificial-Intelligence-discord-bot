const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId, required: true},
	user: {type: String, required: true},
	votes: {type: Number, default: 0},
	lastdaily: {type: Date, default: new Date('2010-12-31T23:59:59.999Z')},
	guilds: {type: Array, default: []},
	balance: {type: Number, default: 0},
	lastwork: {type: Date, default: new Date('2010-12-31T23:59:59.999Z')},
	lastcrime: {type: Date, default: new Date('2010-12-31T23:59:59.999Z')},
	lastslut: {type: Date, default: new Date('2010-12-31T23:59:59.999Z')}
});
module.exports = mongoose.model('Users', productSchema);
