const autoprefixer = require('autoprefixer');
const cssHasPseudo = require('css-has-pseudo');

const config = {
	plugins: [autoprefixer, cssHasPseudo({}), autoprefixer]
};

module.exports = config;
