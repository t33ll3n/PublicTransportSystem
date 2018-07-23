function submiteDesiredLine() {
	let zacetna_postaja = $('#zacetek').val();
	let koncna_postaja = $('#konec').val();
	let datum = $('#dan').val();

	//console.log(zacetna_postaja + ', ' + koncna_postaja + ', ' + datum);
	let podatki = {
		zacetna_postaja: zacetna_postaja,
		koncna_postaja: koncna_postaja,
		datum: datum
	}

	$.post('/search', podatki)
		.done(function(data) {
			//console.log('done');
			//console.log(data);

			let len = data.length;
			if (len == 0) {
				$('#message').html('<p>Direktna povezava med tema dvema postajama ne obstaja</p>');
				return;
			}

			for (let i = 0; i < len; i++){
				let linija = data[i].linija;
				let vstop = data[i].vstop
				let vstop_prihod = data[i].vstop_prihod;
				let izstop = data[i].izstop;
				let izstop_prihod = data[i].izstop_prihod;

				let html = '<tr><td>'+ linija +'</td><td>'+ vstop +'</td><td>'+ vstop_prihod +'</td><td>'+ izstop +'</td><td>'+ izstop_prihod +'</td></tr>';
				$('#result  tbody > tr').remove()
				$('#result tbody').append(html);
			}
		})
		.fail(function() {
			$('#message').html('<p>Nekaj je šlo narobe!</p>');
			console.log('Nekaj je šlo narobe!');
		});
}

let date = new Date();
let day = function() {
	if(date.getDate()< 10)
		return '0' + date.getDate();
	else
		return date.getDate();
}
let month = function() {
	if(date.getMonth()< 10)
		return '0' + (date.getMonth()+1);
	else
		return date.getMonth();
}
let year = date.getFullYear();
$('#dan').val(year+'-'+month()+'-'+day());