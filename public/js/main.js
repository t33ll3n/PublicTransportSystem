$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

/*
$('#loginbtn').click(function(){
	let username = $('#username').val();
	let password = $('pass').val();

	$.post('login', {'username' : username, 'password': password});
})
*/