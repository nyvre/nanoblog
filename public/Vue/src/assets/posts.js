import Parse from 'parse'
export default class PostsBackend {
  constructor() {
    console.log("lol");
  }
  addPostToDatabase(body) {
    return new Promise(function(resolve) {
      Parse.initialize("nanoblogo");
      Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
      var Post = Parse.Object.extend("posts");
      let post = new Post();
      post.set("body", body);
      post.set("author", Parse.User.current());
      return resolve(post.save());
    });
  }
}