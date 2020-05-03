import Parse from 'parse'
export default class DBTool {
  constructor() {
    Parse.initialize("nanoblogo");
    Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
  }
  addPostToDatabase(body) {
    return new Promise(function(resolve) {
      var Post = Parse.Object.extend("posts");
      let post = new Post();
      post.set("body", body);
      post.set("author", Parse.User.current());
      return resolve(post.save());
    });
  }
  addCommentToDatabase(body, parentPostId) {
    return new Promise(function(resolve) {
      var Comment = Parse.Object.extend("Comment");
      var Post = Parse.Object.extend("posts");
      let comment = new Comment();
      comment.set("body", body);
      comment.set("author", Parse.User.current());
      comment.set("parentPost", new Post({ id: parentPostId }));
      return resolve(comment.save());
    });
  }
  addPointToDatabase(parentPostId) {
    return new Promise(function(resolve) {
      var Point = Parse.Object.extend("Point");
      var Post = Parse.Object.extend("posts");
      let point = new Point();
      point.set("author", Parse.User.current());
      point.set("parentPost", new Post({ id: parentPostId }));
      resolve(point.save());
    });
  }
  getPosts() {
    return new Promise(function(resolve) {
      var allPosts = new Parse.Query("posts");
      allPosts.ascending("createdAt");
      allPosts.include("author");
      return resolve(allPosts.find());
    });
  }
  getPoints() {
    return new Promise(function(resolve) {
      var Point = new Parse.Query("Point");
      Point.include("author");
      Point.include("parentPost");
      resolve(Point.find());
    });
  }
  getComments() {
    return new Promise(function(resolve) {
      var Comment = new Parse.Query("Comment");
      Comment.ascending("createdAt");
      Comment.include("author");
      Comment.include("parentPost");
      return resolve(Comment.find());
    });
  }
  getUserLikedPosts() {
    return new Promise(function(resolve) {
      var Point = new Parse.Query("Point");
      Point.include("author");
      Point.include("parentPost");
      let sessionToken = localStorage.getItem("Parse/nanoblogo/currentUser");
      let sessionTokenParsed = JSON.parse(sessionToken);
      let userId = sessionTokenParsed.objectId;
      Point.equalTo("author", {
        __type: "Pointer",
        className: "_User",
        objectId: userId
      });
      resolve(Point.find());
    });
  }
  deletePostFromDatabase(objectId) {
    return new Promise (function (resolve) {
      var Post = Parse.Object.extend("posts");
      var query = new Parse.Query(Post);
      query.get(objectId)
      .then((post) => resolve(post.destroy()))
    });
  }
  deleteCorrespondingComments(parentPostId) {
    return new Promise(function (resolve) {
      var Comment = new Parse.Query("Comment");
      Comment.equalTo("parentPost", {
        __type: "Pointer",
        className: "posts",
        objectId: parentPostId
      });
      resolve(Comment.find()
        .then(comments => {
          for (let comment of comments) {
            comment.destroy();
          }
        }));
    })
  }
  deleteCorrespondingPoints(parentPostId) {
    var Point = new Parse.Query("Point");
    Point.include("parentPost");
    Point.equalTo("parentPost", {
      __type: "Pointer",
      className: "posts",
      objectId: parentPostId
    });
    Point.find().then(points => {
      for (let point of points) {
        point.destroy();
      }
    });
  }
}