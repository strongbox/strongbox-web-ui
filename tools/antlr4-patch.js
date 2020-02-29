const replace = require('replace-in-file');
const options = {
    files: ['./node_modules/antlr4/CharStreams.js', './node_modules/antlr4/FileStream.js'],
    from: /var fs.*/g,
    to: 'var fs = false'
}

replace(options)
    .then(results => {
        console.log('Replacement results:', results);
    })
    .catch(error => {
      console.log('Error occurred:', error);
    });
