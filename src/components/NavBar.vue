<template>
<div class='nav-bar'>

    <div class='navbar-left'><span class='navbar-label'>{{ title[0] }}</span></div>
    <div class='navbar-right'>
        <span class='navbar-label'>{{ title[1] }}</span>
        <span class='navbar-label'>{{ title[2] }}</span>
    </div>

</div>
</template>

<script>
export default {
  name: 'nav-bar',
  data : function(){
      return {
        title : ["Conway's Game of Life", "About", "Home"],
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.font.im/css?family=Orbitron');
.nav-bar{
position: fixed;
width: 100%;
height: 80px;
display: flex;
flex-direction: row;
align-items: center;
z-index : 1;
}
.navbar-left{
left: 90px;
position: fixed;
}
.navbar-right{
right: 40px;
display: flex;
flex-direction: row;
position: fixed;
}
.navbar-label{
font-family: 'Orbitron', sans-serif;
color: white;
font-size: 24px;
margin-left: 20px;
margin-right: 20px;
}
</style>
