const express = require('express');

const router = express.Router();
const connection = require('../mysqlConnection');

//Read
router.get('/:id', (req, res) => {
	let vsebuje_id = req.params.id;

	let sql = 'SELECT * FROM Vsebuje WHERE id = ' + vsebuje_id;
	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if (rows.length === 0){
			res.status('404').send('Vsebuje s tem ID-jem ne obstaja!');
			return;
		}

		res.send(rows);
	});
});

//Create
router.post('/', (req, res) => {

	//console.log('Got request on /api/linija');

	//read values from request body
	let zaporedna_st = req.body.zaporedna_st;
	let linija_id = req.body.linija_id;
	let postaja_id = req.body.postaja_id;
	let razdalja_do_naslednje = req.body.razdalja_do_naslednje;
	

	connection.query('INSERT INTO Vsebuje(zaporedna_st, linija_id, postaja_id, razdalja_do_naslednje) VALUES ('
	 + zaporedna_st +', ' + linija_id + ', ' + postaja_id + ', ' + razdalja_do_naslednje ')', (err, result) => {
	 	if (err){
	 		console.log(err.stack);
	 	}
	 	console.log('result: ' + result);
	 	res.send(result);
	 });	 
});

//update
router.put('/:id', (req, res) => {
	let vsebuje_id = req.params.id;

	console.log(vsebuje_id);

	let sql = 'SELECT * from Vsebuje where id = ' + vsebuje_id;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if(rows.length === 0){
			res.status('404').send('Vsebuje z tem ID-jem ne obstaja');
			return;
		}

		if (rows.length != 1){
			res.status('Database error');
			return;
		}
				
		let zaporedna_st = req.body.zaporedna_st;
		let linija_id = req.body.linija_id;
		let postaja_id = req.body.postaja_id;
		let razdalja_do_naslednje = req.body.razdalja_do_naslednje;


		let updateQuery = 'UPDATE Vsebuje SET zaporedna_st = ' + zaporedna_st 
			+ ', linija_id = ' + linija_id + ', postaja_id = ' + postaja_id + ', razdalja_do_naslednje = ' + razdalja_do_naslednje
			+ ' where id = ' + vsebuje_id;

		connection.query(updateQuery, (err, result) => {
			if (err) res.send(err);
			res.send('1 rows updated');
		});
		
	});
});

router.delete('/:id', (req, res) => {
	let vsebuje_id = req.params.id;

	let sql = 'DELETE FROM Vsebuje WHERE linija_id = ' + vsebuje_id;

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