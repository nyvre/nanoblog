function createUserInDatabase(username, password) {
	Parse.initialize("nanoblogo");
	Parse.serverURL = "https://nanoblogo.herokuapp.com:8080/parse";
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.signUp()
		.then(function(success) {
			window.open("/", "_self");
	}, function(err) {
		console.error(err);
	});
}

function logInUser (username, password) {
	Parse.initialize("nanoblogo");
	Parse.serverURL = "https://nanoblogo.herokuapp.com:8080/parse";
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.logIn()
		.then(function(success) {
			window.open("/", "_self");
	}, function(err) {
		console.error(err);
	});
}

function logOutCurrentUser() {
	Parse.initialize("nanoblogo");
	Parse.serverURL = "https://nanoblogo.herokuapp.com:8080/parse";
	Parse.User.logOut()
		.then(function (success) {
			window.open("/", "_self");
	}, function(err) {
	console.error(err);
	});
}
function getCurrentUser() {
	Parse.initialize("nanoblogo");
	Parse.serverURL = "https://nanoblogo.herokuapp.com:8080/parse";
	return Parse.User.current().getUsername();
}

