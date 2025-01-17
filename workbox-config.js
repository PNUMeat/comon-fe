module.exports = {
	globDirectory: 'src/',
	globPatterns: [
		'**/*.{png,woff2,svg,css}'
	],
	swDest: 'src/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};