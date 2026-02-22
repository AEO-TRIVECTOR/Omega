// Noop module to replace Pages Router error pages
// This prevents Next.js 14 from trying to render fallback error pages
// using Pages Router code that imports <Html> from next/document
module.exports = function() { return null }
module.exports.default = function() { return null }
