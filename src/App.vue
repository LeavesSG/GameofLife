<template>
  <nav-bar />
  <game-canvas />
  <game-background msg="Welcome to Your Vue.js App"/>
  <drop-blocks />
</template>

<script>
import GameBackground from './components/GameBackground.vue';
import NavBar from './components/NavBar.vue';
import GameCanvas from './components/GameCanvas.vue';
import DropBlocks from './components/DropBlocks.vue'

export default {
  name: 'App',
  components: {
    GameBackground,
    NavBar,
    GameCanvas,
    DropBlocks,
  }
}
</script>

<style>
body{
  margin: 0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
</style>
