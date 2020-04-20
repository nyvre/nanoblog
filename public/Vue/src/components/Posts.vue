<template>
  <div>
    <p v-bind:key='post.objectId' v-for='post in posts' id='post' name='post'>Author: {{post.author}} Post: {{post.body}} Created at: {{post.createdAt}}</p>
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
              "author": post.get("author").get("username"), 
              "body":  post.get("body"), 
              "createdAt": post.get("createdAt")})
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
          .then((success) => {
            this.posts = success.reverse();
            /* #TODO
             * Z jakiegos powodu nie mozna dostac sie do tablicy posts poprzez this.posts tylko trzeba przez parenta
            */
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
        let postBody = document.getElementById("new-post").value;
        this.addPostToDatabase(postBody).then(() => {this.populatePostsData()});
      },
      checkForNewPosts () {
        setInterval(this.populatePostsData, 10000);
      }
    },
    components: {
    },
    mounted () {
      this.populatePostsData();
      this.checkForNewPosts();
    },
  }
</script>

<style>
</style>
