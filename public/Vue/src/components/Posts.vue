<template>
  <div>
    <form>
      <input type="text" id="post-body">
      <input type="submit" value="Dodaj post" v-on:click="addPost">
    </form>
    <div v-bind:key='post.objectId' v-for='post in posts' id='post' name='post'>
      Author: {{post.author}} Post: {{post.body}} Created at: {{post.createdAt}}
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
        return new Promise(function(resolve) {
          let postsFormated = [];
          for (let post of posts) {
            postsFormated.push({
              "objectId": post.id, 
              "author": post.get("author").get("username"), 
              "body":  post.get("body"), 
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
        let postBody = document.getElementById("post-body").value;
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
      this.checkForNewPosts();
    },
  }
</script>

<style>
</style>
