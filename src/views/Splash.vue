<template>
<div class="Splash">
<img src="../assets/logo.png" width="100%" height="100%"/>
</div>
</template>
<script>
 import router from '../plugins/router';

export default {
  name: "Splash",
  components: {}
};
 setTimeout(function(){ 
   router.push({name:"Play"});
   }, 3200);
</script>

