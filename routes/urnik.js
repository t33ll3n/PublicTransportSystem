const express = require('express');

const router = express.Router();
const connection = require('../mysqlConnection');

//Read
router.get('/:id', (req, res) => {
	let urnik_id = req.params.id;

	let sql = 'SELECT * FROM Urnik WHERE id = ' + urnik_id;
	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if (rows.length === 0){
			res.status('404').send('Urnik s tem ID-jem ne obstaja!');
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
	let zacetni_cas = req.body.zacetni_cas;
	

	connection.query('INSERT INTO Urnik(linija_id, zacetni_cas) VALUES ('
	 + linija_id +', ' + zacetni_cas + ')', (err, result) => {
	 	if (err){
	 		console.log(err.stack);
	 	}
	 	console.log('result: ' + result);
	 	res.send(result);
	 });	 
});

//Update
router.put('/:id', (req, res) => {
	let urnik_id = req.params.id;

	console.log(urnik_id);

	let sql = 'SELECT * from Urnik where id = ' + urnik_id;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if(rows.length === 0){
			res.status('404').send('Urnik z tem ID-jem ne obstaja');
			return;
		}

		if (rows.length != 1){
			res.status('Database error');
			return;
		}
				
		let linija_id = req.body.linija_id;
		let zacetni_cas = req.body.zacetni_cas;


		let updateQuery = 'UPDATE Urnik SET linija_id = ' + linija_id 
			+ ', zacetni_cas = ' + zacetni_cas + 
			+ ' where urnik_id = ' + urnik_id;

		connection.query(updateQuery, (err, result) => {
			if (err) res.send(err);
			res.send('1 rows updated');
		});
		
	});
});

//Delete
router.delete('/:id', (req, res) => {
	let urnik_id = req.params.id;

	let sql = 'DELETE FROM Urnik WHERE id = ' + urnik_id;

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