
var express = require("express");
var stylus = require("stylus");
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";
var app = express();
var logger = morgan('combined');


function compile(str, path) {
    return stylus(str).set('filename', path);
}

app.set("views", __dirname + "/server/views");
app.set("view engine", "jade");

app.use(morgan('dev'));
//app.use(express.bodyParser());

app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: compile
    }
));
app.use(express.static(__dirname + '/public'));


app.get('/partials/:partialPath', function (req, res) {
    res.render('partials/' + req.params.partialPath);
});

mongoose.connect('mongodb://localhost/multivision');
//multivision is database. It will be created if it does not exist
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
    console.log('multivision db opened');
});

var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec(function(err, messageDoc) {
    mongoMessage = messageDoc.message;
});

app.get('/', function(req, res) {
    res.render('index', {
        mongoMessage: mongoMessage
    });
});

var port = process.env.PORT || 3030;
app.listen(port);
console.log("Listenning on port " + port + "...");

//var http = require('http');
//var port = process.env.port || 1337;
//http.createServer(function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/plain' });
//    res.end('Hello World\n');
//}).listen(port);