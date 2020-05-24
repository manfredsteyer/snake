var ghpages = require('gh-pages');

var callback = function(error) {
  if (!error) {
    console.debug('OK');
  }
  else {
    console.error('Error: ', error);
  }
}

ghpages.publish('dist/shell', {
  repo: 'https://github.com/manfredsteyer/snake-host'
}, callback);
