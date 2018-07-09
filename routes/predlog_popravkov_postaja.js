const express = require('express');

const router = express.Router();
const connection = require('../mysqlConnection');

//Read
router.get('/:id', (req, res) => {
	let popravek_id = req.params.id;

	let sql = 'SELECT * FROM predlogi_popravkov_postaja WHERE popravek_id = ' + popravek_id;
	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if (rows.length === 0){
			res.status('404').send('Popravek s tem ID-jem ne obstaja!');
			return;
		}

		res.send(rows);
	});
});

//Create
router.post('/', (req, res) => {

	//console.log('Got request on /api/linija');

	//read values from request body
	let tip_napake = req.body.tip_napake;
	let predlagan_popravek = req.body.predlagan_popravek;
	let status = req.body.status;
	let postaja_id = req.body.postaja_id;
	

	connection.query('INSERT INTO predlogi_popravkov_postaja(tip_napake, predlagan_popravek, status, postaja_id) VALUES ('
	 + tip_napake +', ' + predlagan_popravek + ', ' + status + ', ' + postaja_id + ')', (err, result) => {
	 	if (err){
	 		console.log(err.stack);
	 	}
	 	console.log('result: ' + result);
	 	res.send(result);
	 });	 
});

//Update
router.put('/:id', (req, res) => {
	let popravek_id = req.params.id;

	console.log(popravek_id);

	let sql = 'SELECT * from predlogi_popravkov_postaja where popravek_id = ' + popravek_id;

	connection.query(sql, (err, rows, fields) => {
		if (err) {
			res.send(err);
			return;
		}

		if(rows.length === 0){
			res.status('404').send('Popravek z tem ID-jem ne obstaja');
			return;
		}

		if (rows.length != 1){
			res.status('Database error');
			return;
		}
				
		let tip_napake = req.body.tip_napake;
		let predlagan_popravek = req.body.predlagan_popravek;
		let status = req.body.status;
		let postaja_id = req.body.postaja_id;


		let updateQuery = 'UPDATE predlogi_popravkov_postaja SET tip_napake = ' + tip_napake 
			+ ', predlagan_popravek = ' + predlagan_popravek + ', status = ' + status + ', postaja_id = ' + postaja_id
			+ ' where popravek_id = ' + popravek_id;

		connection.query(updateQuery, (err, result) => {
			if (err) res.send(err);
			res.send('1 rows updated');
		});
		
	});
});

//Delete
router.delete('/:id', (req, res) => {
	let popravek_id = req.params.id;

	let sql = 'DELETE FROM predlogi_popravkov_postaja WHERE popravek_id = ' + popravek_id;

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