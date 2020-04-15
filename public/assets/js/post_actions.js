function getPosts() {
	Parse.initialize("nanoblogo");
	Parse.serverURL = "https://nanoblogo.herokuapp.com:8080/parse";
	var allPosts = new Parse.Query("posts");
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
	Parse.serverURL = "https://nanoblogo.herokuapp.com:8080/parse";
	var Post = Parse.Object.extend("posts");
	post = new Post();
	post.set("body", body);
	post.set("author", Parse.User.current());
	post.save();
	window.open("/", "_self");
}

