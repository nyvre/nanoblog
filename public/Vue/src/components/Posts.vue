<template>
  <div>
    <div style="bottom:0px;align-items:center;display: flex;justify-content: center;">

      <input
        style="margin-left:0px;margin-right:50px;max-width:60%; margin-top:50px;"
        v-if="username!=''"
        placeholder="Tutaj możesz podzielić sie swoimi przemyśleniami z innymi Nanonkami!"
        type="text"
        id="post-body"
        name="post-body"
        class="textbox"
        wrap="soft"
      />
      <input
        v-if="username!=''"
        type="submit"
        v-on:click="addPost"
        class="add-post-btn pointer"
        style="margin-top:50px;color:white;background:#006666;border-radius:10px;padding:7px 10px"
        value="Dodaj post"
      />
    </div>
    <a v-if="username!=''" id="currentUser">
    <p style="text-align:center;;margin-top:50px;margin-bottom:5px;color:black;">{{username}} Czy chcesz wyświetlać posty od ostatniej wiztyty?</p>
    </a>
    <div align = 'center' ><input class="toggle toggle-right" id="toggle-off" type="radio" name="postType" v-model="newOrAllPosts" value="newPosts" v-on:click="populatePostsData()"><label for="toggle-off" class="btn"><b>Tak</b></label><input id="toggle-on" class="toggle toggle-left" type="radio" name="postType" v-model="newOrAllPosts" value="allPosts" checked v-on:click="populatePostsData()"> <label for="toggle-on" class="btn"><b>Nie</b></label>
    </div>
    <div
      v-bind:key="post.objectId"
      v-for="post in posts"
      :id="post.objectId"
      name="post"
      class="chat"
    >
      <div class="chatinfo">
        <span text-align='left'>
          <span class="author" float='left'>{{post.author}}</span>
        {{post.createdAt}}
        </span>
        <span style='position:absolute;left:95%;top:30%;text-align:right;'>        
          <input
            v-if="username!=''"
            type="submit"
            v-on:click="addPoint(post.objectId)"
            :id="post.objectId + '-point-btn'"
            class="add-point-btn"
            value="+"
          />
          <span v-if="points[post.objectId]">{{points[post.objectId].length}}</span>
          <span v-else>0</span>
        </span>        

      </div>
      <div style="margin-left:20px;font-size:15px;max-width:50%;">
        <p class="messagebox">{{post.body}}</p>
      </div>
      <br />
      <div style ="position:relative;align:center">
        <textarea
          v-if="username!=''"
          type="text"
          :id="post.objectId + '-comment'"
          name="comment-body"
          class="textbox"
          wrap=''
          style="background:#d7f3e9;max-width:50%;"
        />
        <input
          v-if="username!=''"
          type="submit"
          v-on:click="addComment(post.objectId)"
          class="add-comment- btn pointer"
          style="border-color:#d7f3e9;color:black;background:#c1e0d6;border-radius:10px;padding:7px 10px"
          value="›"
        />
      </div>
      <div :id="post.objectId + '-comments'" style="display:none">
        <div
          style="margin-left: 35px;border: 5px dotted rgba(28,110,164,0.27);
border-radius: 40px 40px 40px 40px;border-radius:10px;padding-top: 20px;padding-right: 20px; padding-bottom: 20px;padding-left: 20px;"
          class="komentarzyki"
          v-bind:key="comment.objectId"
          v-for="comment in comments[post.objectId]"
        >
          <span style="font-weight: bold;">{{comment.author}}&nbsp;</span>
          <span style="font-style: italic;">{{comment.createdAt}}</span>
          <br />
          <br />
          <span style="margin-left:35px">{{comment.body}}&nbsp;</span>
          <br />
        </div>
        <br />
      </div>
      <div style="position:relative" v-if="comments[post.objectId]">
        <br />
        <br />
        Ilość komentarzy: {{comments[post.objectId].length}}
        <button
          class="pointer"
          type="button"
          style="border:#d7f3e9;position:absolute;color:black;background:#d7f3e9;border-radius:10px;padding:1px 10px;left:50%;width:100px;"
          v-on:click="toggleCommentsVisibility(post.objectId)"
          :id="post.objectId + '-comments-toggle-btn'"
        >⇓</button>
        <span>
          <input
          v-if="username === post.author"
          class="pointer"
          type="submit"
          value="-"
          :id="post.objectId"
          v-on:click="deletePost(post.objectId)"
          style="position:absolute;color:#d7f3e9;background:red;border-radius:10px;padding:3px 5px;left:95%;"
          />
        </span>
      </div>
      <div style="position:relative" v-else>Ilość komentarzy: 0        
        <span>
          <input
            display= 'inline-block'
            v-if="username === post.author"
            class="pointer"
            type="submit"
            value="-"
            :id="post.objectId"
            v-on:click="deletePost(post.objectId)"
            style="position:absolute;color:white;background:red;border-radius:10px;padding:3px 5px;left:95%;"
            />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Parse from "parse";
export default {
  name: "Posts",
  data: function() {
    return {
      posts: [],
      comments: [],
      points: [],
      userLikedPosts: [],
      newOrAllPosts: "allPosts"
    };
  },
  props: ["username", "lastSeen"],
  methods: {
    getPosts() {
      return new Promise(function(resolve) {
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
        var allPosts = new Parse.Query("posts");
        allPosts.ascending("createdAt");
        allPosts.include("author");
        return resolve(allPosts.find());
      });
    },
    formatPosts(posts) {
      var self = this;
      var timeNow = new Date();
      return new Promise(function(resolve) {
        let postsFormated = [];
        if (self.newOrAllPosts == "newPosts") {
          for (let post of posts) {
            if (post.get("createdAt") > self.lastSeen) {
              let elapsedTime = timeNow - post.get("createdAt");
              let formattedElapsedTime = self.formatElapsedTime(elapsedTime);
              postsFormated.push({
                objectId: post.id,
                author: post.get("author").get("username"),
                body: post.get("body"),
                createdAt: formattedElapsedTime
              });
            }
          }
        } else {
          for (let post of posts) {
            let elapsedTime = timeNow - post.get("createdAt");
            let formattedElapsedTime = self.formatElapsedTime(elapsedTime);
            postsFormated.push({
              objectId: post.id,
              author: post.get("author").get("username"),
              body: post.get("body"),
              createdAt: formattedElapsedTime
            });
          }
        }
        return resolve(postsFormated);
      });
    },
    getAndFormatPosts() {
      var self = this;
      return new Promise(function(resolve) {
        return resolve(
          self.getPosts().then(function(posts) {
            return self.formatPosts(posts);
          })
        );
      });
    },
    getComments() {
      return new Promise(function(resolve) {
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
        var Comment = new Parse.Query("Comment");
        Comment.ascending("createdAt");
        Comment.include("author");
        Comment.include("parentPost");
        return resolve(Comment.find());
      });
    },
    formatComments(comments) {
      var self = this;
      var timeNow = new Date();
      return new Promise(function(resolve) {
        let commentsFormated = {};
        for (let comment of comments) {
          let key = comment.get("parentPost").id;
          let elapsedTime = timeNow - comment.get("createdAt");
          let formattedElapsedTime = self.formatElapsedTime(elapsedTime);
          if (commentsFormated[key]) {
            commentsFormated[key].push({
              objectId: comment.id,
              author: comment.get("author").get("username"),
              body: comment.get("body"),
              createdAt: formattedElapsedTime
            });
          } else {
            commentsFormated[key] = [
              {
                objectId: comment.id,
                author: comment.get("author").get("username"),
                body: comment.get("body"),
                createdAt: formattedElapsedTime
              }
            ];
          }
        }
        return resolve(commentsFormated);
      });
    },
    formatElapsedTime (elapsedTime) {
      let elapsedTimeInSeconds = elapsedTime / 1000;
      if (elapsedTimeInSeconds < 60) {
        return Math.round(elapsedTimeInSeconds) + ' sekund temu'
      }
      let elapsedTimeInMinutes = elapsedTimeInSeconds / 60;
      if (elapsedTimeInMinutes < 60) {
        return Math.round(elapsedTimeInMinutes) + ' minut temu'
      }
      let elapsedTimeInHours = elapsedTimeInMinutes / 60;
      if (elapsedTimeInHours < 24) {
        return Math.round(elapsedTimeInHours) + ' godzin temu'
      }
      let elapsedTimeInDays = elapsedTimeInHours / 24;
      if (elapsedTimeInDays < 30) {
        return Math.round(elapsedTimeInDays) + ' dni temu'
      }
      let elapsedTimeInMonths = elapsedTimeInDays / 30;
      if (elapsedTimeInMonths < 12) {
        return Math.round(elapsedTimeInMonths) + ' miesięcy temu'
      } 
      let elapsedTimeInYears = elapsedTimeInDays / 12;
      return Math.round(elapsedTimeInYears) + ' lat temu'
    },
    getAndFormatComments() {
      var self = this;
      return new Promise(function(resolve) {
        return resolve(
          self.getComments().then(function(comments) {
            return self.formatComments(comments);
          })
        );
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
        comment.set("parentPost", new Post({ id: parentPostId }));
        return resolve(comment.save());
      });
    },
    addComment(parentPostId) {
      let comment = document.getElementById(parentPostId + "-comment");
      let commentBody = comment.value;
      comment.value = "";
      this.addCommentToDatabase(commentBody, parentPostId).then(() => {
        this.populateCommentsData();
      });
    },
    getPoints() {
      return new Promise(function(resolve) {
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
        var Point = new Parse.Query("Point");
        Point.include("author");
        Point.include("parentPost");
        resolve(Point.find());
      });
    },
    formatPoints(points) {
      return new Promise(function(resolve) {
        let pointsFormated = {};
        for (let point of points) {
          let key = point.get("parentPost").id;
          if (pointsFormated[key]) {
            pointsFormated[key].push({
              objectId: point.id,
              author: point.get("author").get("username")
            });
          } else {
            pointsFormated[key] = [
              {
                objectId: point.id,
                author: point.get("author").get("username")
              }
            ];
          }
        }
        resolve(pointsFormated);
      });
    },
    getAndFormatPoints() {
      var self = this;
      return new Promise(function(resolve) {
        resolve(
          self.getPoints().then(function(points) {
            self.formatPoints(points);
          })
        );
      });
    },
    addPointToDatabase(parentPostId) {
      return new Promise(function(resolve) {
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
        var Point = Parse.Object.extend("Point");
        var Post = Parse.Object.extend("posts");
        let point = new Point();
        point.set("author", Parse.User.current());
        point.set("parentPost", new Post({ id: parentPostId }));
        resolve(point.save());
      });
    },
    populatePostsData() {
      console.log("populate");
      this.getAndFormatPosts()
        .then(retrieviedPosts => {
          this.posts = retrieviedPosts.reverse();
        })
        .then(() => {
          return this.getUserLikedPosts();
        })
        .then(userLikedPosts => this.disableAlreadyLikedPosts(userLikedPosts));
    },
    populateCommentsData() {
      this.getAndFormatComments().then(retrieviedComments => {
        this.comments = retrieviedComments;
      });
    },
    populatePointsData() {
      this.getPoints()
        .then(points => this.formatPoints(points))
        .then(retrieviedPoints => (this.points = retrieviedPoints));
    },
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
    },
    addPost() {
      let post = document.getElementById("post-body");
      let postBody = post.value;
      post.value = "";
      this.addPostToDatabase(postBody).then(() => {
        this.populatePostsData();
      });
    },
    addPoint(parentPostId) {
      var self = this;
      let likeButton = document.getElementById(parentPostId + "-point-btn");
      likeButton.disabled = true;
      likeButton.style.background = "green";
      this.getPoints()
        .then(function(points) {
          return self.formatPoints(points);
        })
        .then(function(retrieviedPoints) {
          self.points = retrieviedPoints;
          return self.addPointToDatabase(parentPostId);
        })
        .then(function() {
          return self.populatePointsData();
        });
    },
    deletePost(objectId) {
      Parse.initialize("nanoblogo");
      Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
      var Post = Parse.Object.extend("posts");
      var query = new Parse.Query(Post);
      query.get(objectId).then(
        post => {
          new Promise(resolve =>
            resolve(this.deleteCorrespondingComments(objectId))
          )
            .then(() => this.deleteCorrespondingPoints(objectId))
            .then(() => post.destroy())
            .then(() => this.populatePostsData());
          alert("Post został usunięty");
        },
        () => {
          alert("Post nie istnieje");
          this.populatePostsData();
        }
      );
    },
    deleteCorrespondingComments(parentPostId) {
      Parse.initialize("nanoblogo");
      Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
      var Comment = new Parse.Query("Comment");
      Comment.equalTo("parentPost", {
        __type: "Pointer",
        className: "posts",
        objectId: parentPostId
      });
      Comment.find().then(comments => {
        for (let comment of comments) {
          comment.destroy();
        }
      });
    },
    deleteCorrespondingPoints(parentPostId) {
      Parse.initialize("nanoblogo");
      Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
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
    },
    checkForNewComments() {
      setInterval(this.populateCommentsData, 10000);
    },
    getUserLikedPosts() {
      return new Promise(function(resolve) {
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
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
    },
    disableAlreadyLikedPosts(userLikedPosts) {
      for (let likedPost of userLikedPosts) {
        let likeButton = document.getElementById(
          likedPost.get("parentPost").id + "-point-btn"
        );
        if (likeButton) {
          likeButton.disabled = true;
          likeButton.style.background = "green";
        }
      }
    },
    toggleCommentsVisibility(objectId) {
      let commentsBlock = document.getElementById(objectId + '-comments');
      let toggleButton = document.getElementById(objectId + '-comments-toggle-btn')
      if (commentsBlock.style.display === "none") {
        commentsBlock.style.display = "block"
        toggleButton.innerHTML = "⇑"
      } else {
        commentsBlock.style.display = "none";
        toggleButton.innerHTML = "⇓"
      }
    }
  },
  mounted() {
    this.populatePostsData();
    this.populateCommentsData();
    this.populatePointsData();
    this.checkForNewComments();
  }
};
</script>

<style scoped>
.messagebox {
  border-radius: 5px;
  display: inline-block;
  padding: 10px;
  font-weight: lighter;
  font-size: small;
}
.chatinfo {
  font-size: 14px;
  padding: 10px;
  line-height: 40px;
  display: block;
  position:relative;
}
.chat {
  max-width: 50vw;
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: auto;
  margin-right: auto;
  background: #d7f3e9;
  border-radius: 5px;
  display: compact;
  padding: 20px;
  font-weight: lighter;
  font-size: small;
}
.delete-post {grid-area:bottom-left;}
.show-comments {grid-area:bottom-center;}
.count-comments {grid-area:bottom-right;}

.author {
  grid-area:top-right;
  font-weight: bold;
}
.textbox {
  margin-left: 50px;
  margin-right: 25px;
  height: 20px;
  border: 1px solid #888;
  font-size: 16px;
  width: 2000px;
  padding: 0;
  -moz-box-shadow: inset -3px -3px 10px #eee;
  -webkit-box-shadow: inset -3px -3px 10px #eee;
  box-shadow: inset -3px -3px 10px #eee;
  border-radius: 15px;
  resize: none;
}
.pointer {
  cursor: pointer;
}
.komentarzyki {
  margin: 10px;
}
.add-point-btn{
color:#006666;
cursor: pointer;
border-radius: 15px;
padding:5px;
font: bold;
vertical-align: text-bottom;
padding:3px 5px;
}
.btn{
    border: 3px solid #006666;
    display: inline-block;
    padding: 5px;
    position: relative;
    text-align: center;
    transition: background 600ms ease, color 600ms ease;
}
input[type="radio"].toggle {
    display: none;
}
</style>