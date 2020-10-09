
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const ejs = require('ejs');
const passport = require('passport');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ejslint = require('ejs-lint');
const User = require('./models/user');
// Config app dependencies
require('./config/db');
require('./config/passport');


// Config app
app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');




// Init passport and an active session, if there is one
app.use(session({
  secret: process.env.SESSION_SECRET || 'local-fcc-pinterestclone-app',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./util').attachUser);
// Config routes
app.use(require('./routes/app.js'));
app.use(require('./routes/auth.js'));
app.use(require('./routes/errors.js'));
//app.use(require('./routes/app.js'));
var likebutton = require('./routes/io.js');

// Config socket connection handlers
io.on('connection', function(socket) {likebutton(io, socket)});


//Start server
http.listen(app.get('port'));
