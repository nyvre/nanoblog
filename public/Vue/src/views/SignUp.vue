<template>
  <div class ='login'>
  <div class='login-header'>
  <h1>Sign up</h1>
  </div>
    <div id="login-form">
      <h3>Username: </h3>
      <input placeholder = 'Username' type="text" id="username">
      <h3>Password: </h3>
      <input placeholder = 'Password'  type="password" id="password">
      <br>
      <div class ='parent'>
      <input class='login-button' type="submit" value="Sign up" v-on:click="createUserInDatabase">
    </div>
    </div>
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
h1, h2, h3, h4, h5, h6, a {
  margin:0; padding:0;
  color:#006666;
}
.login {
  margin:0 auto;
  max-width:500px;
}
.login-header {
  padding:10px;
  color:#006666;
  text-align:center;
  font-size:200%;
}
.login-form {
  border:.5px solid #fff;
  background:#4facff;
  border-radius:10px;
  box-shadow:0px 0px 10px #000;
}
.login input[type="text"],
.login input[type="password"] {
  max-width:400px;
	width: 80%;
  line-height:3em;
  font-family: 'Ubuntu', sans-serif;
  margin:1em 2em;
  border-radius:5px;
  border:2px solid #f2f2f2;
  outline:none;
  padding-left:10px;
}
  .login-button {
  height:30px;
  width:100px;
  background:#fff;
  border:1px solid #f2f2f2;
  border-radius:20px;
  color: slategrey;
  text-transform:uppercase;
  font-family: 'Ubuntu', sans-serif;
  cursor:pointer;
  margin:auto;
  display:block
  }
  .parent {
    margin:1em 2em;
    padding-right:20px;
}
</style>
