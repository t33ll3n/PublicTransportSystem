const express = require('express');

const router = express.Router();
const connection = require('../mysqlConnection');

//Read
router.get('/:id', (req, res) => {
	let ocena_id = req.params.id;

	let sql = 'SELECT * FROM Ocena_linije WHERE ocena_id = ' + ocena_id;
	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if (rows.length === 0){
			res.status('404').send('Ocena s tem ID-jem ne obstaja!');
			return;
		}

		res.send(rows);
	});
});

//Create
router.post('/', (req, res) => {

	//console.log('Got request on /api/linija');

	//read values from request body
	let linija_id = req.body.linija_id;
	let uporabnik_id = req.body.uporabnik_id;
	let ocena = req.body.ocena;
	

	connection.query('INSERT INTO Ocena_linije(linija_id, uporabnik_id, ocena) VALUES ('
	 + linija_id +', ' + uporabnik_id + ', ' + ocena + ')', (err, result) => {
	 	if (err){
	 		console.log(err.stack);
	 	}
	 	console.log('result: ' + result);
	 	res.send(result);
	 });
});

router.put('/:id', (req, res) => {
	let ocena_id = req.params.id;

	console.log(ocena_id);

	let sql = 'SELECT * from Ocena where ocena_id = ' + ocena_id;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if(rows.length === 0){
			res.status('404').send('Ocena z tem ID-jem ne obstaja');
			return;
		}

		if (rows.length != 1){
			res.status('Database error');
			return;
		}
				
		let linija_id = req.body.linija_id;
		let uporabnik_id = req.body.uporabnik_id;
		let ocena = req.body.ocena;
	
		let updateQuery = 'UPDATE Ocena_linije SET linija_id = ' + linija_id 
			+ ', uporabnik_id = ' + uporabnik_id + ', ocena = ' + ocena
			+ ' where ocena_id = ' + ocena_id;

		connection.query(updateQuery, (err, result) => {
			if (err) res.send(err);
			res.send('1 rows updated');
		});
		
	});
});

router.delete('/:id', (req, res) => {
	let linija_id = req.params.id;

	let sql = 'DELETE FROM Ocena_linije WHERE ocena_id = ' + ocena_id;

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