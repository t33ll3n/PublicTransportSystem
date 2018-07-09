const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');

const connection = require('./mysqlConnection');
const linija = require('./routes/linija');
const ocena_linije = require('./routes/ocena_linije');
const postaja = require('./routes/postaja.js');
const predlogi_linija = require('./routes/predlogi_popravkov_linija');
const predlogi_popravkov_postaja = require('./routes/predlogi_popravkov_postaja');
const uporabnik = require('./routes/uporabnik');
const urnik = require('./routes/urnik');
const vsebuje = require('./routes/vsebuje');

const app = express();

app.use(bodyParser.json());



connection.connect(function(err){
	if (err){
		console.log('Error connection to database: ' + err.stack);
		return;
	}
	console.log('Connection to database successful. Connection id ' + connection.threadId);
});

app.get('/', (req, res) => { // "arrow" function, equals to function (req, res) { ... }
	res.send("Hello World!") 
});

app.use('/api/linija', linija);
app.use('/api/ocena_linije', ocena_linije);
app.use('/api/postaja', postaja);
app.use('/api/predlogi_linija', predlogi_linija);
app.use('/api/predlogi_popravkov_postaja', predlogi_popravkov_postaja);
app.use('/api/uporabnik', uporabnik);
app.use('/api/urnik', urnik);
app.use('/api/vsebuje', vsebuje);

app.listen(3000, () => { // "arrow" function, equals to function (req, res) { ... }
	console.log('Listening on port 3000...');
});