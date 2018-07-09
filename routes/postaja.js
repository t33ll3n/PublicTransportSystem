const express = require('express');

const router = express.Router();
const connection = require('../mysqlConnection');

//Read
router.get('/:id', (req, res) => {
	let postaja_id = req.params.id;

	let sql = 'SELECT * FROM Postaja WHERE postaja_id = ' + postaja_id;
	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if (rows.length === 0){
			res.status('404').send('Postaja s tem ID-jem ne obstaja!');
			return;
		}

		res.send(rows);
	});
});

//Create
router.post('/', (req, res) => {

	//console.log('Got request on /api/linija');

	//read values from request body
	let postaja_ime = req.body.postaja_ime;
	let altitude = req.body.altitude;
	let longitude = req.body.longitude;
	let isChecked = req.body.isChecked;
	

	connection.query('INSERT INTO Postaja(postaja_ime, altitude, longitude, isChecked) VALUES ('
	 + postaja_ime +', ' + altitude + ', ' + longitude + ', ' + isChecked + ')', (err, result) => {
	 	if (err){
	 		console.log(err.stack);
	 	}
	 	console.log('result: ' + result);
	 	res.send(result);
	 });
});

//Update
router.put('/:id', (req, res) => {
	let postaja_id = req.params.id;

	console.log(linija_id);

	let sql = 'SELECT * from Postaja where linija_id = ' + postaja_id;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if(rows.length === 0){
			res.status('404').send('Postaja z tem ID-jem ne obstaja');
			return;
		}

		if (rows.length != 1){
			res.status('Database error');
			return;
		}
				
		let postaja_ime = req.body.pastaja_ime;
		let altitude = req.body.altitude;
		let longitude = req.body.longitude;
		let isChecked = req.body.isChecked;


		let updateQuery = 'UPDATE Postaja SET postaja_ime = ' + postaja_ime 
			+ ', altitude = ' + altitude + ', longitude = ' + longitude + ', isChecked = ' + isChecked
			+ ' where postaja_id = ' + postaja_id;

		connection.query(updateQuery, (err, result) => {
			if (err) res.send(err);
			res.send('1 rows updated');
		});
		
	});
});

//delete
router.delete('/:id', (req, res) => {
	let linija_id = req.params.id;

	let sql = 'DELETE FROM Postaja WHERE postaja_id = ' + postaja_id;

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