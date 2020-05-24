var ghpages = require('gh-pages');

var callback = function(error) {
  if (!error) {
    console.debug('Deployed to https://manfredsteyer.github.io/snake-host/');
  }
  else {
    console.error('Error: ', error);
  }
}

ghpages.publish('dist/shell', {
  repo: 'https://github.com/manfredsteyer/snake-host'
}, callback);
