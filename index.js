const express = require('express');
const app = express();

app.get('/', (req, res) => { // "arrow" function, equals to function (req, res) { ... }
	res.send("Hello World!") 
});

app.listen(3000, () => { // "arrow" function, equals to function (req, res) { ... }
	console.log('Listening on port 3000...');
});