<template>
  <div id="app">
    <div id="nav">
      <NavigationBar v-bind:username="username" v-on:user-logged-out="logOutUser"/>
    </div>
    <router-view v-bind:username="username" v-bind:lastSeen="lastSeen" v-on:user-logged-in="updateUser"/>
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
        username: "",
        lastSeen: Date
      }
    },
    methods: {
      updateUser() {
        Parse.initialize("nanoblogo");
        Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
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
          this.username = "";
        }
        setTimeout(stopWaitingForUser, 2000);
      },
      logOutUser() {
        this.username = "";
      },
      getUserLastSeenTime () {
        return new Promise (function (resolve) {
          Parse.initialize("nanoblogo");
          Parse.serverURL = "https://nanoblogo.herokuapp.com/parse";
          var LastSeen = new Parse.Query("LastSeen"); 
          let sessionToken = localStorage.getItem("Parse/nanoblogo/currentUser");
          let sessionTokenParsed = JSON.parse(sessionToken);
          let userId = sessionTokenParsed.objectId;
          LastSeen.equalTo('User', { "__type": "Pointer", "className": "_User", "objectId": userId});
          resolve(LastSeen.find());
        })
      },
      updateUserLastSeenTime () {
        this.getUserLastSeenTime()
        .then((lastSeenObject) => {
          lastSeenObject[0].set("Date", new Date());
          lastSeenObject[0].save();
        })
      }
    },
    created() {
      this.updateUser();
      this.getUserLastSeenTime().
        then(lastSeen => {
          this.lastSeen = lastSeen[0].get("Date");
        });
      window.addEventListener('beforeunload', this.updateUserLastSeenTime);
    }
  }
</script>

<style>
  *{
  margin:0;
  padding: 0;
  list-style:none;
  text-decoration: none;
  }
  body {
  background:#ecf2f9;
  margin:0px;
  font-family: 'Ubuntu', sans-serif;
	background-size: 100% 110%;
}
</style>
