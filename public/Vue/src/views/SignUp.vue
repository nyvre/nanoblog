<template>
  <div>
    <form>
      <input type="text" id="username">
      <input type="text" id="password">
      <input type="submit" value="Sign up" v-on:click="createUserInDatabase">
    </form>
  </div>
</template>

<script>
  import Parse from 'parse'
export default {
  name: 'SignUp',
  methods : {
    createUserInDatabase() {
      let username = document.getElementById("username").value;
      let password = document.getElementById("password").value;
      Parse.initialize("nanoblogo");
      Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
      var user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.signUp()
        .then(this.$emit("user-logged-in"))
        .then(this.$router.push("/"));
    }
  }
}
</script>
<style scoped>
</style>
