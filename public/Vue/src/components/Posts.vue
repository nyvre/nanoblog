<template>
  <div>
    <div style='bottom:0px;align-items:center;display: flex;justify-content: center;'>
      <a v-if="username!=''" id="currentUser"><li> Cześć, {{username}}</li></a>
      <input v-if="username!=''" placeholder= "Tutaj możesz podzielić sie swoimi przemyśleniami z innymi Nanonkami!" type="text" id="post-body" name="post-body" class='textbox' wrap="soft" />
      <input v-if="username!=''" type="submit" v-on:click="addPost" class="add-post-btn" style="color:green;background:#ffffe6;border-radius:10px" > 
    </div>
    <div v-bind:key='post.objectId' v-for='post in posts' :id='post.objectId' name='post' class='chat'>
      <p class='chatinfo'> <span class='author'>{{post.author}}</span> {{post.createdAt}} Points: <span v-if="points[post.objectId]"> {{points[post.objectId].length}} </span> <span v-else>0</span> 
      <input v-if="username!=''" type="submit" v-on:click="addPoint(post.objectId)" :id="post.objectId + '-point-btn'" class="add-point-btn" style="color:green;background:#ffffe6;border-radius:10px;visibility:visible" value="+"></p>
      <p class='messagebox' >{{post.body}}</p>
      <p> (SCHOWANE KOMENTARZE) {{comments[post.objectId]}} </p>
      <p v-if="comments[post.objectId]">Ilość komnentarzy: {{comments[post.objectId].length}} (TUTAJ POWINIEN POJAWIĆ SIĘ PRZYCISK KTÓRY ROZWINIE KOMENTARZE)</p>
      <p v-else>Ilość komentarzy: 0</p>
      <textarea v-if="username!=''" type="text" :id="post.objectId + '-comment'" name="comment-body" class='textbox' wrap="soft" />
      <input v-if="username!=''" type="submit" v-on:click="addComment(post.objectId)" class="add-comment- btn" style="color:green;background:#ffffe6;border-radius:10px" >
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
        posts: [],
        comments: [],
        points: [],
        userLikedPosts: [],
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
        return new Promise(function(resolve) {
          let postsFormated = [];
          for (let post of posts) {
            postsFormated.push({
              "objectId": post.id, 
              "author": post.get("author").get("username"), 
              "body": post.get("body"), 
              "createdAt": post.get("createdAt")
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
      getComments () {
        return new Promise(function (resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Comment = new Parse.Query("Comment");
          Comment.ascending("createdAt");               
          Comment.include("author");
          Comment.include("parentPost");
          return resolve(Comment.find());
        });
      },
      formatComments (comments) {
        return new Promise(function(resolve) {
          let commentsFormated = {};
          for (let comment of comments) {
            let key = comment.get("parentPost").id;
            if (commentsFormated[key]) {
              commentsFormated[key].push({
                "objectId": comment.id, 
                "author": comment.get("author").get("username"), 
                "body": comment.get("body"), 
                "createdAt": comment.get("createdAt")
              })
            } else {
              commentsFormated[key] = [{
                "objectId": comment.id, 
                "author": comment.get("author").get("username"), 
                "body": comment.get("body"), 
                "createdAt": comment.get("createdAt")
              }]
            }
          }
          return resolve(commentsFormated);
        });
      },
      getAndFormatComments() {
        var self = this;
        return new Promise(function(resolve) {
          return resolve(self.getComments()
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
        this.addCommentToDatabase(commentBody, parentPostId)
          .then(() => {this.populateCommentsData()});
      },
      getPoints () {
        return new Promise(function (resolve) {
          console.log("getPoints()");
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Point = new Parse.Query("Point");
          Point.include("author");
          Point.include("parentPost");
          resolve(Point.find());
        });
      },
      formatPoints (points) {
        return new Promise(function(resolve) {
          console.log("formatPoints()");
          let pointsFormated = {};
          for (let point of points) {
            let key = point.get("parentPost").id;
            if (pointsFormated[key]) {
              pointsFormated[key].push({
                "objectId": point.id, 
                "author": point.get("author").get("username"), 
              })
            } else {
              pointsFormated[key] = [{
                "objectId": point.id, 
                "author": point.get("author").get("username"), 
              }]
            }
          }
          resolve(pointsFormated);
        });
      },
      getAndFormatPoints() {
        var self = this;
        return new Promise(function(resolve) {
          resolve(self.getPoints()
            .then(function (points) {
               self.formatPoints(points)
            })
          )
        });
      },
      addPointToDatabase (parentPostId) {
        console.log("addPointToDatabase()");
        return new Promise(function (resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Point = Parse.Object.extend("Point");
          var Post = Parse.Object.extend("posts");
          let point = new Point();
          point.set("author", Parse.User.current());
          point.set("parentPost", new Post({id : parentPostId}));
          resolve(point.save());
        });
      },
      populatePostsData () {
        this.getAndFormatPosts()
          .then((retrieviedPosts) => {
            this.posts = retrieviedPosts.reverse();
          }).then(() => {
            return this.getUserLikedPosts()
          }).then(userLikedPosts => this.disableAlreadyLikedPosts(userLikedPosts));
      },
      populateCommentsData () {
        this.getAndFormatComments()
          .then((retrieviedComments) => {
            this.comments = retrieviedComments;
          })
      },
      populatePointsData () {
        this.getPoints()
          .then((points) => this.formatPoints(points))
          .then((retrieviedPoints) => this.points = retrieviedPoints);
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
        this.addPostToDatabase(postBody)
          .then(() => {this.populatePostsData()});
      },
      addPoint (parentPostId) {   
      var self = this; 
      let likeButton = document.getElementById(parentPostId + '-point-btn');
      likeButton.disabled = true;
      likeButton.style.background = "#00ff00";
      this.getPoints().then(function (points) {
          return self.formatPoints(points)
        }).then(function (retrieviedPoints) {
          self.points = retrieviedPoints;
          return self.addPointToDatabase(parentPostId)
        }).then(function () {
          return self.populatePointsData()
        })
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
        setInterval(this.populateCommentsData, 10000);
      },
      getUserLikedPosts() {
        return new Promise(function (resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var Point = new Parse.Query("Point");
          Point.include("author");
          Point.include("parentPost");
          let sessionToken = localStorage.getItem("Parse/nanoblogo/currentUser");
          let sessionTokenParsed = JSON.parse(sessionToken);
          let userId = sessionTokenParsed.objectId;
          Point.equalTo('author', { "__type": "Pointer", "className": "_User", "objectId": userId});
          resolve(Point.find())
        })
      },
      disableAlreadyLikedPosts (userLikedPosts) {
        for (let likedPost of userLikedPosts) {
          console.log(likedPost.get("parentPost"));
          let likeButton = document.getElementById(likedPost.get("parentPost").id + '-point-btn');
          if (likeButton) {
            console.log("mehere");
            likeButton.disabled = true;
            likeButton.style.background = "#00ff00";
          }
        }
      }
    },
    mounted () {
      this.populatePostsData()
      this.populateCommentsData();
      this.populatePointsData();
      this.checkForNewPosts();
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
      border: 1px solid #888 ;
      font-size: 16px;
    width: 2000px;
    padding:0;
    -moz-box-shadow: inset -3px -3px 10px #eee;
    -webkit-box-shadow: inset -3px -3px 10px #eee;
    box-shadow: inset -3px -3px 10px #eee;
   border-radius: 15px;
   resize: none;
   
  }
  .author {
    font-weight: bold
  }
</style>
