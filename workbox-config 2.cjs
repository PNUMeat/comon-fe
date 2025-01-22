module.exports = {
  globDirectory: 'src/',
  globPatterns: ['**/*.{png,woff2,svg,css}'],
  swSrc: 'src/workers/cacheWorker.ts',
  swDest: 'src/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
