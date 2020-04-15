Parse.initialize("nanoblogo");
Parse.serverURL = "http://localhost:8080/parse";

var user = newParse.User();
user.set("username", "admin");
user.ser("password", "admin1");
Parse.User.logIn(user)
	.then(function(success) {
		console.log(success)
	});
