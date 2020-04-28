<template>
  <div>
    <div style='bottom:0px;align-items:center;display: flex;justify-content: center;'>
      <a v-if="username!=''" id="currentUser"><li>Jesteś zalogowany jako {{username}}</li></a>
      <textarea type="text" id="post-body" name="post-body" class='textbox' wrap="soft" />
      <input type="submit" v-on:click="addPost" class="add-post-btn" style="color:green;background:#ffffe6;border-radius:10px" > 
    </div>
    <div v-bind:key='post.objectId' v-for='post in posts' :id='post.objectId' name='post' class='chat'>
      <p class='chatinfo'> <span class='author'>{{post.author}}</span> {{post.createdAt}} Points: {{post.points}} <input type="submit" v-on:click="addPoint(post.objectId)" class="add-point-btn" style="color:green;background:#ffffe6;border-radius:10px" value="+"></p>
      <p class='messagebox'>{{post.body}}</p>
      <p> {{post.comments}} </p>
      <textarea type="text" :id="post.objectId + '-comment'" name="comment-body" class='textbox' wrap="soft" />
      <input type="submit" v-on:click="addComment(post.objectId)" class="add-comment-btn" style="color:green;background:#ffffe6;border-radius:10px" >
      <br>
      <div v-if="username === post.author">
        <input type="submit" value="Usun post" :id=post.objectId v-on:click="deletePost(post.objectId)">
      </div>
    </div>
  </div>
</template>

<script>
  import Parse from 'parse'
  export default {
    name: "Posts",
    data: function() {
      return {
        posts: []
      }
    },
    props: ["username"],
    methods : {
      getPosts () {
        return new Promise(function (resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var allPosts = new Parse.Query("posts");
          allPosts.ascending("createdAt");
          allPosts.include("author");
          return resolve(allPosts.find());
        });
      },
      formatPosts (posts) {
        var self = this;
        return new Promise(function(resolve) {
          let postsFormated = [];
          for (let post of posts) {
            Promise.all([self.getAndFormatComments(post.id), self.getPoints(post.id)])
            .then(([comments, points]) => {
              postsFormated.push({
                "objectId": post.id, 
                "author": post.get("author").get("username"), 
                "body": post.get("body"), 
                "comments": comments,
                "points": points,
                "createdAt": post.get("createdAt")
              })
            })
          }
          return resolve(postsFormated);
        });
      },
      getAndFormatPosts () {
        var self = this;
        return new Promise(function(resolve) {
          return resolve(self.getPosts()
            .then(function (posts) {
              return self.formatPosts(posts)
            })
          )
        });
      },
      getComments (postId) {
        return new Promise(function (resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Comment = new Parse.Query("Comment");
          var Post = Parse.Object.extend('posts');
          Comment.equalTo("parentPost", new Post({id : postId}));
          Comment.ascending("createdAt");
          Comment.include("author");
          return resolve(Comment.find());
        });
      },
      formatComments (comments) {
        return new Promise(function(resolve) {
          let commentsFormated = [];
          for (let comment of comments) {
            commentsFormated.push({
              "objectId": comment.id, 
              "author": comment.get("author").get("username"), 
              "body": comment.get("body"), 
              "createdAt": comment.get("createdAt")
            })
          }
          return resolve(commentsFormated);
        });
      },
      getAndFormatComments(postId) {
        var self = this;
        return new Promise(function(resolve) {
          return resolve(self.getComments(postId)
            .then(function (comments) {
              return self.formatComments(comments)
            })
          )
        });
      },
      addCommentToDatabase(body, parentPostId) {
        return new Promise(function(resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Comment = Parse.Object.extend("Comment");
          var Post = Parse.Object.extend("posts");
          let comment = new Comment();
          comment.set("body", body);
          comment.set("author", Parse.User.current());
          comment.set("parentPost", new Post({id : parentPostId}));
          return(resolve(comment.save()));
        });
      },
      addComment (parentPostId) {
        let comment = document.getElementById(parentPostId + "-comment");
        let commentBody = comment.value;
        comment.value = "";
        this.addCommentToDatabase(commentBody, parentPostId).then(() => {this.populatePostsData()});
      },
      getPoints (postId) {
        return new Promise(function (resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Point = new Parse.Query("Point");
          var Post = Parse.Object.extend('posts');
          Point.equalTo("parentPost", new Post({id : postId}));
          return resolve(Point.count());
        });
      },
      addPoint (parentPostId) {
        return new Promise(function (resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Point = Parse.Object.extend("Point");
          var Post = Parse.Object.extend("posts");
          //var User = Parse.Object.extend("User");
          let point = new Point();
          point.set("author", Parse.User.current());
          point.set("parentPost", new Post({id : parentPostId}));
          return(resolve(point.save()));
        });
      },
      populatePostsData () {
        this.getAndFormatPosts()
          .then((retrieviedPosts) => {
            this.posts = retrieviedPosts.reverse();
          })
      },
      addPostToDatabase(body) {
        return new Promise(function(resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Post = Parse.Object.extend("posts");
          let post = new Post();
          post.set("body", body);
          post.set("author", Parse.User.current());
          return(resolve(post.save()));
        });
      },
      addPost () {
        let post = document.getElementById("post-body");
        let postBody = post.value;
        post.value = "";
        this.addPostToDatabase(postBody).then(() => {this.populatePostsData()});
      },
      deletePost(objectId) {
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
        var Post = Parse.Object.extend("posts");
        var query = new Parse.Query(Post);
        query.get(objectId)
          .then((post) => {
            post.destroy()
              .then(this.populatePostsData());
            alert("Post został usunięty");
            },() => {
            alert("Post nie istnieje");
            this.populatePostsData()
          });
      },
      checkForNewPosts () {
        setInterval(this.populatePostsData, 10000);
      }
    },
    mounted () {
      this.populatePostsData();
      //this.checkForNewPosts();
    },
  }
</script>

<style scoped>
  .messagebox {
      border-radius: 5px;
      display: inline-block;
      padding: 10px;
      font-weight: lighter;
      font-size: small;
  }
  .chatinfo{
    font-size: small;
    padding: 10px;
  }
  .chat{
    margin: 50px;
    background: #ccffcc;
      border-radius: 5px;
      display: compact;
      padding: 20px;
      font-weight: lighter;
      font-size: small;
  }
  .textbox {
    margin: 50px;
      height: 20px;
      border: 1px solid ;
      background-color: white;
      font-size: 16px;
    width: 2000px;
    padding:0;
    border-radius:4px;
  }
  .author {
    font-weight: bold
  }
</style>
