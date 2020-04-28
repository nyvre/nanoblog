<template>
  <div class="header">
      <div class ='innerheader'>
        <div class ='logo_container'>
          <h1>Nano<span>Blog</span></h1>
        </div>
      <ul class='navigation'>
      <router-link to="/"><li>Home</li></router-link>
      <router-link to="/login" v-if="username===''"><li>Zaloguj się</li></router-link>
      <router-link to="/signup"  v-if="username===''"><li>Zarejestruj się</li></router-link>
      <router-link to="/about"><li>About</li></router-link>
      <a v-on:click="logOut" v-if="username!=''"><li>Wyloguj sie</li></a>
      </ul>
      </div>
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
  },
  props: ["username"]
}
</script>
<style scoped>
  .header{
    width: 100%;
    background: #006666;
    display:block;
    height:80px;
    margin: 0px auto;
    text-align:center;
  }
    .innerheader{
    max-width: 1000px;
    display:block;
    height:100%;
    margin: 0px auto;
  }
  .logo_container{
    height: 100%;
    display:table;
    float:left;
  }
  .logo_container h1{
    color:white;
    height:100%;
    display:table-cell;
    vertical-align:middle;
    font-family:'Montserrat', sans-serif;
    font-size:28px;
    font-weight: 200;
  }
  .logo_container h1 span{
  font-weight: 800;
  }
  .navigation{
    float:right;
    height:100%;
    display:table
  }
  .navigation a{
    height:100%;
    display:table;
    float:left;
    padding:0px 14px;
  }
  .navigation router-link{
    height:100%;
    display:table;
    float:left;
    padding:0px 14px;
  }
  .navigation router-link li {
    display:table-cell;
    vertical-align:middle;
    height:100%;
    color:white;
    
    font-size:10px;
  }
    .navigation a li{
    display:table-cell;
    vertical-align:middle;
    height:100%;
    color:white;
    font-family:'Montserrat', sans-serif;
    font-size:15px;
  }
  .navigation a:last-child{
    padding-right:0px;
  }
</style>
