<template>
  <div>
    <form>
      <input type="text" id="username">
      <input type="password" id="password">
      <input type="submit" value="Log in" v-on:click="logIn">
    </form>
  </div>
</template>

<script>
  import Parse from 'parse'
  export default {
    name: 'LogInPage',
    props: ["username"],
    methods: {
      logIn () {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
        var user = new Parse.User();
        user.set("username", username);
        user.set("password", password);
        user.logIn()
          .then(this.$emit("user-logged-in"))
          .then(this.$router.push("/"));
      }
    }
  }
</script>
<style scoped>
</style>
