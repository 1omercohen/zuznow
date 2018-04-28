var express = require('express');
var bodyParser = require('body-parser')
var server = express();

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use('/api', require('./routes/index'));
server.use('/', express.static('./public/'));


server.listen(3002, function(){
    console.log('server running on port 3002');
});
