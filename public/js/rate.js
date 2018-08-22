var podatki;

function sendData(){
	console.log("Send data");

	let linija = {
		linija: $('#linija').val()
	}
	//console.log(linija)

	$.post('/rate', linija)
		.done(function(data) {

			console.log("Podatki so bili poslani!");
			podatki = data;
			
			let len = data.length;
			if (len == 0) {
				$('#message').html('<p>Direktna povezava med tema dvema postajama ne obstaja</p>');
				return;
			}

			$('#result  tbody > tr').remove();
			for (let i = 0; i < len; i++){
				let vsebuje_id = podatki[i].id;
				let linija_id = podatki[i].linija_id;
				let urnik_id = podatki[i].urnik_id;
				let linija_ime = podatki[i].linija_ime;
				let postaja_ime = podatki[i].postaja_ime;
				let cas_prihoda = podatki[i].cas_prihoda;
				let zap_st = podatki[i].zaporedna_st;

				let html = '<tr><td class="hidden">' + vsebuje_id + '</td><td><input type="text" disabled class="data" value="'+ linija_ime +'"></td><td><input type="text" disabled class="data" value="'+ postaja_ime +'"> '+ 
				'</td><td><input type="time" disabled class="data" value="'+ cas_prihoda +'"></td><td><input type="checkbox">Pravilno</td></tr>';
				//$('#result  tbody > tr').remove()
				$('#result tbody').append(html);
				//console.log(i);
			}

			//$('#submitButton').append('<button class="btn btn-success" onclick="submitRating()">Potrdi</div>');
		})
		.fail(function() {
			console.log("Nekaj je šlo narobe!");
		});
}

function submitRating() {


	let pravilno = [];
	let popravki = [];
	let table = $('#result tbody');

	table.find('tr').each(function (i) {
       	//Reads check box value in table cell number 3.
       	let vsebuje_id = $(this).children('td').eq(0).text();
       	let isChecked = $(this).children('td').eq(4)[0].childNodes[0].checked;
       	let postaja_ime = $(this).children('td').eq(2)[0].childNodes[0].value;
       	let linija_ime = $(this).children('td').eq(1)[0].childNodes[0].value;
       	let cas_prihoda = $(this).children('td').eq(3)[0].childNodes[0].value;

       	let add = false;
       	podatki.find(function (element) {
       		//console.log(element);
       		var data = {
       			vsebuje_id: vsebuje_id,
       			postaja_ime: null,
       			linija_ime: null,
       			cas_prihoda: null
       		}

       		if (element.id == vsebuje_id) {
       			//console.log(element.id);
				if (postaja_ime != element.postaja_ime) {
						data.postaja_ime = postaja_ime;
						add = true;
				}
				if (linija_ime != element.linija_ime) {
						data.linija_ime = linija_ime;
						add = true;
				}
				if (cas_prihoda != element.cas_prihoda) {
						data.cas_prihoda = cas_prihoda;
						add = true;
				}
				if (add){
					popravki.push(data);
				}
       		}
       		
       	});

       	if (add) {
       		return;
       	}

       	let rowData = {
       		vsebuje_id: vsebuje_id,
       		isChecked: isChecked
       	}
        console.log(rowData);
        if (rowData.isChecked == true) {
        	pravilno.push(rowData);
    	}
    });

    console.log(pravilno);
    console.log(popravki);

    $.post('/rating', {pravilni: pravilno, popravki: popravki})
    	.done(function(data) {
    		$('#message').html('<p>Ocene so bile poslane.</p>');
    		console.log(data);
    	})
    	.fail( function() {
    		$('#message').html('<p>Težave pri pošiljanju ocen.</p>');
    	})
}

function toggleEdit() {
	$('.data').prop('disabled', false);
}