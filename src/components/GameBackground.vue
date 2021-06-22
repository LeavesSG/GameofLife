<template>

<div id="background">
  <div id="background-sub"></div>
</div>

</template>

<script>
export default {
  name: 'GameBackground',

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#background{
  position: absolute;
  background-color : black;
  width:100%;
  height: 100%;
  z-index: -1;
}
#background-sub{
  right: 0;
  position: absolute;
  background-color : #212121;
  width:30%;
  height: 100%;
  z-index: -1;
  /* border-left: .5px solid grey; */
  box-shadow: -2px 0px 6px rgba(255, 255, 255, 0.16);
}

</style>
