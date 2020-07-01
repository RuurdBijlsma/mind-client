<template>
<img src="../assets/life.jpeg" width="100%" height="100%"/>
</template>
<script>
export default {
  name: "Splash",
  data() {
    return {
      hello: "world"
    };
  },

  components: {}
};
setTimeout(function(){ window.location.href="/home" }, 2000);
</script>