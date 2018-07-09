const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'borovnice',
	database: 'public_Transport_System'
});

module.exports = connection;