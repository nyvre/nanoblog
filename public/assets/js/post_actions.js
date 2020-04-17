var getPosts = function() {
	return new Promise(function (resolve, reject) {
		Parse.initialize("nanoblogo");
		Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
		var allPosts = new Parse.Query("posts");
		allPosts.ascending("createdAt");
		allPosts.include("author");
		return resolve(allPosts.find());
})};
var addPostToDatabase = function(body) {
	return new Promise(function(resolve, reject) {
		Parse.initialize("nanoblogo");
		Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
		var Post = Parse.Object.extend("posts");
		post = new Post();
		post.set("body", body);
		post.set("author", Parse.User.current());
		return(resolve(post.save()));
	});
}
var formatPosts = function (posts) {
	return new Promise(function(resolve, reject) {
		let postsFormated = [];
		for (post of posts) {
			postsFormated.push({
				"author": post.get("author").get("username"), 
				"body":  post.get("body"), 
				"createdAt": post.get("createdAt")});
		}
		return resolve(postsFormated);
	});
}
function getAndFormatPosts() {
	return new Promise(function(resolve, reject) {
		return resolve(getPosts()
			.then(function (posts) {
				return formatPosts(posts)
			})
		)
	});
}

