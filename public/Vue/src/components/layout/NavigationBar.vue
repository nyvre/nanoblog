<template>
  <header class="header">
      <div v-if="username!=''" id="currentUser">Jesteś zalogowany jako {{username}}</div>
      <router-link class = 'myButton' to="/">Home</router-link> |
      <router-link class = 'myButton' to="/login">Zaloguj się</router-link> |
      <router-link class = 'myButton' to="/signup">Zarejestruj się</router-link> |
      <router-link class = 'myButton' to="/about">About</router-link> |
      <button class='myButton' v-on:click="logOut">Wyloguj sie</button>
  </header>
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
  },
  props: ["username"]
}
</script>
<style scoped>
  .header{
    top: 0px;
    width: 100%;
    background:#009900;
    border: 2px solid #CCC;
    height:70px;
    margin: 0px auto;
    text-align: right;
  }
  .myButton {
    box-shadow: 0px 10px 14px -7px #3e7327;
    background:linear-gradient(to bottom, #77b55a 5%, #72b352 100%);
    background-color:#77b55a;
    border-radius:4px;
    border:1px solid #4b8f29;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-family:Arial;
    font-size:13px;
    font-weight:bold;
    padding:6px 12px;
    text-decoration:none;
    text-shadow:0px 1px 0px #5b8a3c;
  }
  .myButton:hover {
    background:linear-gradient(to bottom, #72b352 5%, #77b55a 100%);
    background-color:#72b352;
  }
  .myButton:active {
    position:relative;
    top:1px;
  }
</style>
