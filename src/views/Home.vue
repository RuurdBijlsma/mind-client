<template>
  <div class="home">
    <h1>Home Page {{hello}}</h1>
    <ul>
      <router-link to="play" class="btn btn-primary">New Game</router-link>

      <router-link to="play" class="btn btn-success">Tutorial</router-link>

      <router-link to="play" class="btn btn-info">Settings</router-link>
    </ul>
  </div>
</template>


<script>
export default {
  name: "Home",
  data() {
    return {
      hello: "world"
    };
  },

  components: {}
};
</script>
