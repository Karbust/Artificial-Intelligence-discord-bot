const sendMSG = require('../functions-msg.js');
const config = require('../config.json');
module.exports.run = async (prefix, client, message, args, id) => {
	if (!config.whitelist.includes(message.author.id)) return;
	try {
		const code = args.join(' ');
		let evaled = eval(code);
		if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
		sendMSG.sendMessage(message.channel, clean(evaled), {code: 'xl'});
	} catch (err) {
		sendMSG.sendError(message.channel, `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
	}
};
exports.help = {
	name: 'eval',
	category: 'Owner',
	description: 'Eval a text.',
	usage: 'eval <what>'
};

function clean(text) {
	if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
