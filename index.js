const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const session = require('express-session');
const cookieParser = require('cookie-parser');

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
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	key: 'user_sid',
	secret: 'krneki neki',
	resave: true,
	saveUninitialized: false,
	cookie: {
		expires: 600000
	}
}));

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {

	//console.log(req.cookies);
	if (req.cookies.user_sid && !req.session.user){
		res.clearCookie('user__sid');
	}
	next();
});


var sessionChecker = (req, res, next) => {
	if (req.session.user && req.cookies.user_sid) {
		//console.log('redirect ro account');
		res.redirect('/account');
	} else {
		//console.log('session does not exists');
		next();
	}
};

connection.connect(function(err){
	if (err){
		console.log('Error connection to database: ' + err.stack);
		return;
	}
	console.log('Connection to database successful. Connection id ' + connection.threadId);
});

app.get('/', sessionChecker, (req, res) => { // "arrow" function, equals to function (req, res) { ... }
	//res.send("Hello World!") 
	res.render('index', {title: 'Hello World!', message: 'Pug template engine'});
	console.log(req.session);
});

app.post('/register', (req, res) => {

	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let isCompany = false;
	let encrypPass;

	bcrypt.hash(password, null, null, function(err, hash) {
		encrypPass = hash;
		connection.query('INSERT INTO Uporabnik(username, password, email, isCompany) VALUES ("'+ username +'", "' + encrypPass + '", "' + email + '", ' + isCompany + ')', (err, result) => {
	 	if (err){
	 		console.log(err.stack);
	 	}
	 	console.log('result: ' + result);
	 	res.redirect('/login');
	 	res.render('login', {message: 'Uspesno ste se registrirali. Za nadavljevanje se prosim prijavite.'});
	 });
	});
	 
});

app.get('/login', sessionChecker, (req, res) => {

	//sessionChecker checks if user is already logged in or has an open session.
	console.log('Get request on /login');
	res.render('login');	
	res.end();
});

app.post('/login', (req, res, next) => {
	let username = req.body.username;
	let password = req.body.password;

	let sql = 'SELECT * FROM Uporabnik WHERE username = "' + username + '"';
	connection.query(sql, function (err, rows, fields) {
		if(err){
			console.log('err getting dat from db');
			//return res.send(err);
		}

		if (rows.length === 0){
			//res.render('/login', {message: 'Uporabniško ime ali geslo ni pravilno.'})
			return res.redirect('./login');
		}

		let User = rows[0];
		
		if (rows.length === 1){
			let encrypPass = rows[0].password;
			console.log(encrypPass);

			bcrypt.compare(password, encrypPass, function(err, result) {
				if (result){
					console.log('password correct.');
					req.session.user = User;
					console.log(req.session);
					console.log(req.cookies);
					return res.redirect('/account');
				} else {
					console.log('password incorrect');
					return res.render('/login', {message: 'Uporabniško ime ali geslo ni pravilno'});
				}
			});	
		}
	});
	
	console.log('Post request on /login');
});

app.get('/logout', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		res.redirect('/login');
	} else {
		res.redirect('/login');
	}
});

app.get('/account', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        //res.sendFile(__dirname + '/public/dashboard.html');
        res.send('/account');
    } else {
        res.redirect('/login');
    }
});

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
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