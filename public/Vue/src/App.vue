<template>
  <div id="app">
    <div id="nav">
      <NavigationBar v-bind:username="username"/>
    </div>
    <router-view v-bind:username="username" v-on:user-logged-in="updateUser"/>
  </div>
</template>

<script>
  import NavigationBar from "./components/layout/NavigationBar.vue"
  import Parse from 'parse'
  export default {
    name: "app",
    components: {
      NavigationBar,
    },
    data() {
      return {
        username: ""
      }
    },
    methods: {
      updateUser() {
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
        localStorage.removeItem("Parse/nanoblogo/currentUser");
        let waitForUser = setInterval(
          () => {
            let currentUser = localStorage.getItem("Parse/nanoblogo/currentUser");
            if (currentUser !== null) {
              this.username = Parse.User.current().getUsername();
              clearInterval(waitForUser)
            }
          }, 100);
        function stopWaitingForUser() {
          clearInterval(waitForUser)
        }
        setTimeout(stopWaitingForUser, 2000);
      }
    },
    created() {
      this.updateUser()
    }
  }
</script>

<style>
  * {
    margin: 0;
    font-family: tahoma, sans-serif;
    box-sizing: border- box;
  }
  body{
    background: #ffffe6;
    padding: 10px;
  }
</style>
