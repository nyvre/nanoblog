function createUserInDatabase(username, password) {
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.signUp()
		.then(function(success) {
			console.log("User has been created")
	}, function(err) {
		console.error(err);
	});
}

function logInUser(username, password) {
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.logIn()
		.then(function(success) {
			console.log("User has been logged in")
	}, function(err) {
		console.error(err);
	});
}

Parse.initialize("nanoblogo");
Parse.serverURL = "http://localhost:8080/parse";

