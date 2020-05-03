<template>
  <div>
    <div style="bottom:0px;align-items:center;display: flex;justify-content: center;">

      <input
        style="margin-left:0px;margin-right:50px;max-width:60%; margin-top:50px;"
        v-if="username!=''"
        placeholder="  Tutaj możesz podzielić sie swoimi przemyśleniami z innymi Nanonkami!"
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
    <p style="text-align:center;margin-top:50px;margin-bottom:5px;color:black;">{{username}} czy chcesz wyświetlać posty od ostatniej wizyty?</p>
    
    <div class='switch' align = 'center' ><input class="switch-input" id="toggle-off" type="radio" name="postType" v-model="newOrAllPosts" value="newPosts" v-on:click="populatePostsData()"><label for="toggle-off" class="switch-label switch-label-off"><b>Tak</b></label><input id="toggle-on" class="switch-input" type="radio" name="postType" v-model="newOrAllPosts" value="allPosts" checked v-on:click="populatePostsData()"> <label for="toggle-on" class="switch-label switch-label-on"><b>Nie</b></label>
    </div>
    </a>
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
        <span >        
          <span style='color:#006666;position:absolute;left:100%;bottom:65%;' v-if="points[post.objectId]">{{points[post.objectId].length}}</span>
          <span style='color:#006666;position:absolute;left:100%;bottom:65%;' v-else>0</span><input
             style='position:absolute;left:95%;top:20%;'
            v-if="username!=''"
            type="submit"
            v-on:click="addPoint(post.objectId)"
            :id="post.objectId + '-point-btn'"
            class="add-point-btn"
            value="+"
          />
          
        </span>        

      </div>
      <div style="margin-left:20px;font-size:15px;max-width:50%;">
        <p class="messagebox">{{post.body}}</p>
      </div>
      <br />
      <div style ="align:center;position: relative;">
        <textarea
          placeholder=" Dodaj komentarz"
          v-if="username!=''"
          type="text"
          :id="post.objectId + '-comment'"
          name="comment-body"
          class="textbox"
          wrap=''
          style="position: absolute;background:#d7f3e9;max-width:80%;top: 20%;"
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
          style="position:absolute;color:#d7f3e9;background:red;border-radius:10px;padding:3px 5px;left:95%;bottom:0%"
          />
        </span>
      </div>
      <div style="position:relative;margin-top:15px;" v-else><span>Ilość komentarzy: 0 </span>  
          <input
            display= 'inline-block'
            v-if="username === post.author"
            class="pointer"
            type="submit"
            value="-"
            :id="post.objectId"
            v-on:click="deletePost(post.objectId)"
            style="position:absolute;color:white;background:red;border-radius:10px;padding:3px 5px;left:95%;bottom:-20%"
            />
      </div>
    </div>
  </div>
</template>

<script>
import DBTool from "../assets/DB_Tool.js"
var dbTool = new DBTool();
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
          dbTool.getPosts().then(function(posts) {
            return self.formatPosts(posts);
          })
        );
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
      let elapsedTimeInSeconds = Math.round(elapsedTime / 1000);
      if (elapsedTimeInSeconds < 60) {
        let timeName = ""
        if (elapsedTimeInSeconds === 1) {
          timeName = ' sekundę'
        } else if ("234".indexOf(elapsedTimeInSeconds.toString()[0]) !== -1) {
          timeName = ' sekundy'
        } else {
          timeName = ' sekund'
        }
        return elapsedTimeInSeconds + timeName + ' temu'
      }
      let elapsedTimeInMinutes = Math.round(elapsedTimeInSeconds / 60);
      if (elapsedTimeInMinutes < 60) {
        let timeName = ""
        if (elapsedTimeInMinutes === 1) {
          timeName = ' minutę'
        } else if ("234".indexOf(elapsedTimeInMinutes.toString()[0]) !== -1) {
          timeName = ' minuty'
        } else {
          timeName = ' minut'
        }
        return elapsedTimeInMinutes + timeName + ' temu'
      }
      let elapsedTimeInHours = Math.round(elapsedTimeInMinutes / 60);
      if (elapsedTimeInHours < 24) {
        let timeName = ""
        if (elapsedTimeInHours === 1) {
          timeName = ' godzinę'
        } else if ("234".indexOf(elapsedTimeInHours.toString()[0]) !== -1) {
          timeName = ' godziny'
        } else {
          timeName = ' godzin'
        }
        return elapsedTimeInHours + timeName + ' temu'
      }
      let elapsedTimeInDays = Math.round(elapsedTimeInHours / 24);
      if (elapsedTimeInDays < 30) {
        let timeName = ""
        if (elapsedTimeInDays === 1) {
          timeName = ' dzień'
        } else {
          timeName = ' dni'
        }
        return elapsedTimeInDays + timeName + ' temu'
      }
      let elapsedTimeInMonths = Math.round(elapsedTimeInDays / 30);
      if (elapsedTimeInMonths < 12) {
        let timeName = ""
        if (elapsedTimeInMonths === 1) {
          timeName = ' miesiąc'
        } else if ("234".indexOf(elapsedTimeInMonths.toString()[0]) !== -1) {
          timeName = ' miesiące'
        } else {
          timeName = ' miesięcy'
        }
        return elapsedTimeInMonths + timeName + ' temu'
      } 
      let elapsedTimeInYears = Math.round(elapsedTimeInMonths / 12);
      let timeName = ""
      if (elapsedTimeInYears === 1) {
        timeName = ' rok'
      } else if ("234".indexOf(elapsedTimeInYears.toString()[0]) !== -1) {
        timeName = ' lata'
      } else {
        timeName = ' lat'
      }
      return elapsedTimeInYears + timeName + ' temu'
    },
    getAndFormatComments() {
      var self = this;
      return new Promise(function(resolve) {
        return resolve(
          dbTool.getComments().then(function(comments) {
            return self.formatComments(comments);
          })
        );
      });
    },
    addComment(parentPostId) {
      let comment = document.getElementById(parentPostId + "-comment");
      let commentBody = comment.value;
      comment.value = "";
      dbTool.addCommentToDatabase(commentBody, parentPostId).then(() => {
        this.populateCommentsData();
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
          dbTool.getPoints().then(function(points) {
            self.formatPoints(points);
          })
        );
      });
    },
    populatePostsData() {
      this.getAndFormatPosts()
        .then(retrieviedPosts => {
          this.posts = retrieviedPosts.reverse();
        })
        .then(() => {
          return dbTool.getUserLikedPosts();
        })
        .then(userLikedPosts => this.disableAlreadyLikedPosts(userLikedPosts));
    },
    populateCommentsData() {
      this.getAndFormatComments().then(retrieviedComments => {
        this.comments = retrieviedComments;
      });
    },
    populatePointsData() {
      dbTool.getPoints()
        .then(points => this.formatPoints(points))
        .then(retrieviedPoints => (this.points = retrieviedPoints));
    },
    addPost() {
      let post = document.getElementById("post-body");
      let postBody = post.value;
      post.value = "";
      dbTool.addPostToDatabase(postBody).then(() => {
        this.populatePostsData();
      });
    },
    addPoint(parentPostId) {
      var self = this;
      let likeButton = document.getElementById(parentPostId + "-point-btn");
      likeButton.disabled = true;
      likeButton.style.background = "green";
      dbTool.getPoints()
        .then(function(points) {
          return self.formatPoints(points);
        })
        .then(function(retrieviedPoints) {
          self.points = retrieviedPoints;
          return dbTool.addPointToDatabase(parentPostId);
        })
        .then(function() {
          return self.populatePointsData();
        });
    },
    deletePost(objectId) {
      dbTool.deleteCorrespondingComments(objectId)
      .then(() => dbTool.deleteCorrespondingPoints(objectId))
      .then(() => dbTool.deletePostFromDatabase(objectId))
      .then(() => this.populatePostsData())
    },
    checkForNewComments() {
      setInterval(this.populateCommentsData, 10000);
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

.switch {
  position: relative;
  height: 26px;
  width: 120px;
  margin: 20px auto;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
  
}
.switch-label {
  position: relative;
  z-index: 2;
  float: left;
  width: 58px;
  line-height: 26px;
  font-size: 11px;
  color: #888;
  text-align: center;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
  cursor: pointer;
}
.switch-label:active {
  font-weight: bold;
}

.switch-label-off {
  padding-left: 2px;
}

.switch-label-on {
  padding-right: 2px;
}


.switch-input {
  display: none;
  border:2px;
}
.switch-input:checked + .switch-label {
  font-weight: 500%;
  color: rgba(0, 0, 0, 0.65);
}





</style>