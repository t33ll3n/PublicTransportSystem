const express = require('express');
const router = express.Router();
const connection = require('../mysqlConnection');

//Reads data from database
router.get('/:id', (req, res) => {
	let linija_id = req.params.id;

	let sql = 'SELECT * FROM Linija WHERE linija_id = ' + linija_id;
	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if (rows.length === 0){
			res.status('404').send('Linija s tem ID-jem ne obstaja!');
			return;
		}

		res.send(rows);
	});
});

//works witk raw request body Json encoded. For string use ' '!
//Creates an entry in database
router.post('/', (req, res) => {

	//console.log('Got request on /api/linija');

	//read values from request body
	let linija_ime = req.body.linija_ime;
	let isHoliday = req.body.isHoliday;
	let isChecked = req.body.isChecked;
	

	connection.query('INSERT INTO Linija(linija_ime, isHoliday, isChecked) VALUES ('
	 + linija_ime +', ' + isHoliday + ', ' + isChecked + ')', (err, result) => {
	 	if (err){
	 		console.log(err.stack);
	 	}
	 	console.log('result: ' + result);
	 	res.send(result);
	 });	 
});

//updates an entry in database
router.put('/:id', (req, res) => {
	let linija_id = req.params.id;

	console.log(linija_id);

	let sql = 'SELECT * from Linija where linija_id = ' + linija_id;

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
				
		let linija_ime = req.body.linija_ime;
		let isHoliday = req.body.isHoliday;
		let isChecked = req.body.isChecked;


		let updateQuery = 'UPDATE Linija SET linija_ime = ' + linija_ime 
			+ ', isHoliday = ' + isHoliday + ', isChecked = ' + isChecked
			+ ' where linija_id = ' + linija_id;

		connection.query(updateQuery, (err, result) => {
			if (err) res.send(err);
			res.send('1 rows updated');
		});
		
	});
});

router.delete('/:id', (req, res) => {
	let linija_id = req.params.id;

	let sql = 'DELETE FROM Linija WHERE linija_id = ' + linija_id;

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