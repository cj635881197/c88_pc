<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  destroyed(){
    // alert(1)
  }
}
</script>
<style>
@import './assets/css/reset.css';
@import './assets/css/font.css';
</style>
