if (process.type === 'renderer') {
	module.exports = require('./lib/renderer.js');
} else {
	module.exports = require('./lib/main.js');
}