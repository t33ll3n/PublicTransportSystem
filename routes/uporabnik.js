const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

//Read
router.get('/:id', (req, res) => {
	let user_id = req.params.id;

	let sql = 'SELECT * FROM Uporabnik WHERE user_id = ' + user_id;
	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if (rows.length === 0){
			res.status('404').send('Uporabnik s tem ID-jem ne obstaja!');
			return;
		}

		res.send(rows);
	});
});

//create
router.post('/', (req, res) => {

	//console.log('Got request on /api/linija');

	//read values from request body
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;
	let isCompany = req.body.isCompany;
	

	connection.query('INSERT INTO Uporabnik(username, password, email, isCompany) VALUES ('
	 + username +', ' + password + ', ' + email + ', ' + isCompany + ')', (err, result) => {
	 	if (err){
	 		console.log(err.stack);
	 	}
	 	console.log('result: ' + result);
	 	res.send(result);
	 });
});

//update
router.put('/:id', (req, res) => {
	let user_id = req.params.id;

	console.log(linija_id);

	let sql = 'SELECT * from Uporabnik where user_id = ' + user_id;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if(rows.length === 0){
			res.status('404').send('Linija z tem ID-jem ne obstaja');
			return;
		}

		if (rows.length != 1){
			res.status('Database error');
			return;
		}
				
		let username = req.body.username;
		let password = req.body.password;
		let email = req.body.email;
		let isCompany = req.body.isCompany;


		let updateQuery = 'UPDATE Uporabnik SET username = ' + username 
			+ ', password = ' + password + ', email = ' + emila +', isCompany = ' + isCompany
			+ ' where user_id = ' + user_id;

		connection.query(updateQuery, (err, result) => {
			if (err) res.send(err);
			res.send('1 rows updated');
		});
		
	});
});

router.delete('/:id', (res, req) => {
	let user_id = req.params.id;

	let sql = 'DELETE FROM Uporabnik WHERE user_id = ' + user_id;

	connection.query(sql, (err, result) => {
		if (err){
			res.send(err);
			return;
		}
		if (result.affectedRows != 0){
			res.send(result.affectedRows + ' rows affected.');
		}
		res.send('Delete not successful!');
	});
});

module.exports = router;
