var ghpages = require('gh-pages');
 
ghpages.publish('dist/strategy', function(err) {
    if (err) { 
        console.error('Error', err);
    }
    else {
        console.info('Success');
        console.info('Deployed to: https://<github-user-name>.github.io/<repository-name>');
    }
});
