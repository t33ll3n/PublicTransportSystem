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

app.get('/register', (req, res) => {
	res.render('register');
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
	 	//res.render('login', {message: 'Uspesno ste se registrirali. Za nadavljevanje se prosim prijavite.'});
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
					return res.render('login', {message: 'Uporabniško ime ali geslo ni pravilno'});
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
        res.render('account');
    } else {
        res.redirect('/login');
    }
});

app.get('/addRoute', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.render('addRoute');
	} else {
		res.redirect('/login');
	}
});

app.post('/addRoute', (req, res) => {
	//console.log(req.body);

	let linija = req.body.linija;
	let isHoliday = req.body.isHoliday;
	let postaje = req.body.postaje;
	var linija_id, urnik_id;

	var query = 'INSERT INTO Linija (linija_ime, isChecked) select * from (select "'+ linija +'", '+ true +') AS tmp WHERE NOT EXISTS (select linija_ime from Linija WHERE linija_ime = "'+ linija +'") LIMIT 1';
	connection.query(query, (err, result) => {
		if (err) {
			console.log('err1');
			console.log(err);
			res.send(err);
			return;
		} else {
			console.log('insert linija');

			query = 'select linija_id from linija where linija_ime = "'+ linija +'"';
			connection.query(query, (err, rows, fields) => {
				if (err) {
					console.log('err2');
					res.send(err);
					return;
				} else {
					linija_id = rows[0].linija_id;
					console.log('linija id: ' + linija_id);

					for (let i = 0; i < postaje.length; i++){
						let postaja = postaje[i].postaja;
						let cas = postaje[i].cas;
						//console.log(cas);
						ura = '0000-00-00 0' + cas + ':00';

						if(i == 0){
							query = 'INSERT INTO Urnik(linija_id, zacetni_cas, isHoliday) values ('+ linija_id +', "'+ ura +'", '+ isHoliday +')';
							connection.query(query, (err, result) => {
								if (err){
									console.log('err3');
									console.log(err);
									res.send(err);
								} else {
									console.log('insert urnik');
									query = 'select MAX(urnik_id) as urnik_id from Urnik';
									connection.query(query, (err, rows, fields) => {
										if (err){
											console.log(err);
										} else {
											console.log(rows[0]);
											urnik_id = rows[0].urnik_id;
										}
									})
								}
							});			
						}

						query = 'INSERT INTO Postaja (postaja_ime, isChecked) select * from (select "'+ postaja +'", '+ true +') AS tmp WHERE NOT EXISTS (select postaja_ime from Postaja WHERE postaja_ime = "'+ postaja +'") LIMIT 1';
						connection.query(query, (err, result) => {
							if (err) {
								console.log('err4');
								console.log(err);
								res.send(err);
								return;
							} else {
								console.log('insert postaja');

								var postaja_id;
								query = 'select postaja_id from postaja where postaja_ime = "'+ postaja +'"';
								connection.query(query, (err, rows, fields) => {
									if (err) {
										console.log('err5');
										res.send(err);
										return;
									} else {
										postaja_id = rows[0].postaja_id;
										console.log('postaja id: ' + postaja_id);

										query = 'INSERT INTO Vsebuje(zaporedna_st, linija_id, postaja_id, urnik_id, cas_prihoda) values ("'+ i +'", '+ linija_id +', '+ postaja_id +', '+ urnik_id +', "'+ cas +'")';
										connection.query(query, (err, result) => {
											if (err) {
												console.log('err6');
												console.log(err);
												res.send(err);
											} else {
												console.log('insert vsebuje');
												res.end();
											}
										});
									}
								});
							}
						});
					}
				}
			});
		}
	});	
});

app.get('/search', (req, res) => {
	res.render('search');
});

app.post('/search', (req, res) => {
	let zac_postaja = req.body.zacetna_postaja;
	let kon_postaja = req.body.koncna_postaja;
	let datum = req.body.datum;

	isHoliday = isWeekend(datum);
	console.log('date: ' + isHoliday);

	let query = 'select li.linija_ime as linija, po.postaja_ime as vstop, ur.zacetni_cas vstop_prihod, ko.postaja_ime as izstop, vs2.cas_prihoda as izstop_prihod FROM linija li JOIN Vsebuje vs ON (vs.linija_id = li.linija_id) JOIN Postaja po ON (po.postaja_id = vs.postaja_id) JOIN Urnik ur ON (ur.linija_id = li.linija_id) JOIN Vsebuje vs2 ON (vs2.linija_id = li.linija_id) JOIN Postaja ko ON (ko.postaja_id = vs2.postaja_id) WHERE po.postaja_ime = "' + zac_postaja + '" and ko.postaja_ime = "' + kon_postaja +'" and isHoliday = ' + isHoliday;
	connection.query(query, (err, rows, fields) => {
		if (err)
			res.send(err);
		res.status(200).send(rows);
	});

});

app.get('/rate', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.render('rate');
	} else {
		res.redirect('/login');
	}
});

app.post('/rate', (req,  res) => {
	if (req.session.user && req.cookies.user_sid) {
		//do nothing
	} else {
		res.redirect('/login');
	}

	let linija_ime = req.body.linija;
	console.log(linija_ime);

	let query = 'select li.linija_id, vs.id, vs.urnik_id, linija_ime, po.postaja_ime, cas_prihoda, zaporedna_st from linija li join vsebuje vs on (vs.linija_id = li.linija_id) join postaja po on (po.postaja_id = vs.postaja_id) where linija_ime ="'+linija_ime +'" order by urnik_id, cas_prihoda, zaporedna_st;'
	//console.log('got /rate post req');
	connection.query(query, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}
		console.log(rows.length);
		res.status(200).send(rows);
	})
});

app.post('/rating', (req, res) => {
	
	if (req.session.user && req.cookies.user_sid) {
		//do nothing
		console.log(req.session.user);
		console.log(req.cookies.user__sid);
	} else {
		res.redirect('/login');
		console.log(req.session.user);
		console.log(req.cookies.user__sid);
		return;
	}

	//console.log(req.body);
	let pravilni = req.body.pravilni;
	let popravki = req.body.popravki;

	if(!req.body){
		console.log('Data is null');
		res.end();
		return;
	}
	

	console.log(req.body.pravilni);
	console.log(req.body.popravki);
	
	if (pravilni){
		for (let i = 0; i < pravilni.length; i++){
			let vs_id = pravilni[i].vsebuje_id;
			let rating = pravilni[i].isChecked;
			let user_id = req.session.user.uporabnik_id;

			let query = 'INSERT INTO ocena_linije(vsebuje_id, uporabnik_id, ocena) values (' + vs_id +', ' + user_id + ', '+ rating +')';
			connection.query(query, (err, result) => {
				if (err){
					console.log('Ocena neuspešno vpisana.');
					console.log(err);
					res.send(err);
					return;
				}
				console.log('Ocena dodana.')
				res.end();
			});
		}
	}

	if(popravki){
		for (let i = 0; i < popravki.length; i++){
		let popravek = popravki[i];
		let user_id = req.session.user.uporabnik_id

		if(popravek.postaja_ime){
			let query = 'INSERT INTO predlogi_popravkov(tip_napake, predlagan_popravek, status, vsebuje_id) values("napacno ime postaje", "'+ popravek.postaja_ime +'", false, ' + popravek.vsebuje_id + ', '+ user_id +')';
			connection.query(query, (err, result) => {
				if (err) {
					console.log('NAPAKA PRI VSTAVLJANJU POPRAVKA V PODATKOVNO BAZO =>');
					console.log(err);
					return;
				}
				console.log('Popravek vnesen v bazo!');

			});
		}
		if (popravek.linija_ime){
			let query = 'INSERT INTO predlogi_popravkov(tip_napake, predlagan_popravek, status, vsebuje_id) values("napacno ime linije", "'+ popravek.linija_ime +'", false, ' + popravek.vsebuje_id + ', '+ user_id +')';
			connection.query(query, (err, result) => {
				if (err) {
					console.log('NAPAKA PRI VSTAVLJANJU POPRAVKA V PODATKOVNO BAZO =>');
					console.log(err);
					return;
				}
				console.log('Popravek vnesen v bazo!');

			});
		}
		if (popravek.cas_prihoda){
			let query = 'INSERT INTO predlogi_popravkov(tip_napake, predlagan_popravek, status, vsebuje_id) values("napacen cas prihoda", "'+ popravek.cas_prihoda +'", false, ' + popravek.vsebuje_id + ', '+ user_id +')';
			connection.query(query, (err, result) => {
				if (err) {
					console.log('NAPAKA PRI VSTAVLJANJU POPRAVKA V PODATKOVNO BAZO =>');
					console.log(err);
					return;
				}
				console.log('Popravek vnesen v bazo!');

			});
		}
		
		}	
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

function isWeekend(dateInHtml){
	let dateSplit = dateInHtml.split('-');
	let date = new Date(dateSplit[0], dateSplit[1]-1, dateSplit[2]);
	console.log(date + ': ' +date.getDay());

	if (date.getDay() == 6 || date.getDay() == 0)
		return true;
	return false;
}

app.listen(3000, () => { // "arrow" function, equals to function (req, res) { ... }
	console.log('Listening on port 3000...');
});