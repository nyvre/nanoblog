<template>
  <div id="app">
  <div id ="Home">
    <form>
      <input type="text">
      <input type="submit" value="Dodaj post">
    </form>
    <Posts />
  </div>
</div>
</template>

<script>
import Posts from "../components/Posts.vue"
export default {
  name: 'Home',
  components: {
    Posts
  }, 
}
</script>
