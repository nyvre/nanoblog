<template>
  <div>
    <p v-bind:key='post.objectId' v-for='post in posts' id='post' name='post'>Author: {{post.author}} Post: {{post.body}} Created at: {{post.createdAt}}</p>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    name: "Posts",
    data: function() {
      return {
        posts: []
      }
    },
    components: {
    },
    created : function () {
      $.ajax({
        url: 'https://nanoblogo.herokuapp.com/parse/classes/posts',
        headers: {
          'X-Parse-Application-Id': 'nanoblogo',
          'X-Parse-REST-API-Key': 'restApiKey'
        },
      }).then(res => this.posts = res.results);
    },
  }
</script>

<style>
</style>
