<template>
  <div id="app">
    <div id="nav">
      {{userId}}
      <NavigationBar />
    </div>
    <router-view v-bind:userId="userId" v-on:user-logged-in="updateUser"/>
  </div>
</template>

<script>
  import NavigationBar from "./components/layout/NavigationBar.vue"
  export default {
    name: "app",
    components: {
      NavigationBar,
    },
    data() {
      return {
        userId: "gd"
      }
    },
    methods: {
      updateUser(newUser) {
        this.userId = newUser;
      }
    },
  }
</script>

<style>
</style>
