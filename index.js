const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');

const connection = require('./mysqlConnection');
const linija = require('./routes/linija');
const ocena_linije = require('./routes/ocena_linije');
const postaja = require('./routes/postaja.js');
const predlog_popravkov_linija = require('./routes/predlog_popravkov_linija');
const predlog_popravkov_postaja = require('./routes/predlog_popravkov_postaja');
const uporabnik = require('./routes/uporabnik');
const urnik = require('./routes/urnik');
const vsebuje = require('./routes/vsebuje');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.json());



connection.connect(function(err){
	if (err){
		console.log('Error connection to database: ' + err.stack);
		return;
	}
	console.log('Connection to database successful. Connection id ' + connection.threadId);
});

app.get('/', (req, res) => { // "arrow" function, equals to function (req, res) { ... }
	//res.send("Hello World!") 
	res.render('index', {title: 'Hello World!', message: 'Pug template engine'});
});

//routes
app.use('/api/linija', linija);
app.use('/api/ocena_linije', ocena_linije);
app.use('/api/postaja', postaja);
app.use('/api/predlog_popravkov_linija', predlog_popravkov_linija);
app.use('/api/predlog_popravkov_postaja', predlog_popravkov_postaja);
app.use('/api/uporabnik', uporabnik);
app.use('/api/urnik', urnik);
app.use('/api/vsebuje', vsebuje);

app.listen(3000, () => { // "arrow" function, equals to function (req, res) { ... }
	console.log('Listening on port 3000...');
});