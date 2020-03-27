const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
	_id: {type: mongoose.Schema.Types.ObjectId, required: true},
	guild: {type: String, required: true},
	cc: {type: Array, default: []},
	timers: {type: Array, default: []},
	autorole: {type: Array, default: []},
	verify: {type: Object, default: {}},
	join: {type: Object, default: {}},
	leave: {type: Object, default: {}},
	ai: {type: Boolean, default: true},
	prefix: {type: String, default: '/'},
	premium: {type: Boolean, default: false},
	inviteCode: {type: String, default: null}
});
module.exports = mongoose.model('Guilds', productSchema);
