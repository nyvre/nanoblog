<template>
  <div id="app">
    <div id="nav">
      <NavigationBar />
    </div>
    <router-view/>
  </div>
</template>

<script>
  import NavigationBar from "./components/layout/NavigationBar.vue"
  export default {
    name: "app",
    components: {
      NavigationBar,
    },
  }
</script>

<style>
</style>
