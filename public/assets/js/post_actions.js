function getPosts() {
	Parse.initialize("nanoblogo");
	Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
	var allPosts = new Parse.Query("posts");
	allPosts.ascending("createdAt");
	allPosts.include("author");
	return allPosts.find().then(function(posts) {
		let postsFormated = [];
		for (post of posts) {
			postsFormated.push([post.get("author").get("username"), post.get("body"), post.get("createdAt")]);
		}
		return postsFormated;
	});
}
function addPostToDatabase(body) {
	Parse.initialize("nanoblogo");
	Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
	var Post = Parse.Object.extend("posts");
	post = new Post();
	post.set("body", body);
	post.set("author", Parse.User.current());
	post.save().then(function (result) {
		window.open("/", "_self");
		});
}

