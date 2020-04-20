<template>
  <div>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Zaloguj się</router-link> |
      <router-link to="/signup">Zarejestruj się</router-link> |
      <router-link to="/about">About</router-link>
      <button v-on:click="logOut">Wyloguj sie</button>
  </div>
</template>

<script>
import Parse from 'parse'
export default {
  name: 'NavigationBar',
  methods: {
    logOut() {
      Parse.initialize("nanoblogo");
    Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
    Parse.User.logOut()
    .then(this.$router.push("/"));
  }
  }
}
</script>
<style scoped>
</style>
