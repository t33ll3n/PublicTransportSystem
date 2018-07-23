$(function()
		{
		    $(document).on('click', '.btn-add', function(e)
		    {
		        e.preventDefault();

		        var controlForm = $('.controls form:first'),
		            currentEntry = $(this).closest('.postaje'),
		            newEntry = currentEntry.clone();

		        currentEntry.after(newEntry);
		        newEntry.find('input').val('');
		        /*
		        controlForm.find('.entry:not(:last) .btn-add')
		            .removeClass('btn-add').addClass('btn-remove')
		            .removeClass('btn-success').addClass('btn-danger')
		            .html('<span class="glyphicon glyphicon-minus"></span>');
		        */
		    }).on('click', '.btn-remove', function(e)
		    {
				$(this).parents('.entry:first').remove();

				e.preventDefault();
				return false;
			});
		});

		function readValues() {
			var post = document.getElementsByClassName('postaja');
			var urnik = document.getElementsByClassName('cas');
			//console.log(el[0].value);

			let zacetek = document.getElementsByClassName('zacetek');
			let konec = document.getElementsByClassName('konec');
			let isHoliday = document.getElementById('vikend');
			var postaje = [];

			if (zacetek[0].value.trim() === '' || konec[0].value.trim() === ''){
				return;
			}

			for (let i = 0; i < post.length; i++) {
				if (post[i].value.trim() === '' || urnik[i].value.trim() === ''){
					return;
				}				
				let postaja = {
					postaja: post[i].value,
					cas: urnik[i].value
				}
				postaje.push(postaja);
			}

			var podatki = {
				linija: zacetek[0].value + ' - ' + konec[0].value,
				isHoliday: isHoliday.checked,
				postaje: postaje
			}

			//console.log(podatki);
			$.post('/addRoute', podatki)
				.done(function() {
					console.log('done');
					$('#message').html('<p>Nova pot je bila uspešno kreirana!</p>');
				})
				.fail(function() {
					console.log('fail');
					$('#messge').html('<p>Nekaj je šlo narobe!</p>');
				});
		}