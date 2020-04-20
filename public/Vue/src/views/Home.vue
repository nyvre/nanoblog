<template>
  <div id ="Home">
    <Posts v-bind:username="username"/>
    }
  </div>
</template>

<script>
import Posts from "../components/Posts.vue"
export default {
  name: 'Home',
  components: {
    Posts
  }, 
  props: ['username']
}
</script>
