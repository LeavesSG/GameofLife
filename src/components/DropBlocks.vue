<template>
<div id='container-dropblocks'>
    <div v-for="row in rows" 
        :key="row.key" 
        :id="'row' + row.key" 
        :class="['container-dropblocksrow', (sideLength==40) ? 'container-40px':'']">
        <div v-for="column in columns" 
            :key="column.key" 
            :id="'column'+column.key" 
            :class="[(column.key<blockShow[row.key]) ? 'block-in':'block-out',(sideLength==40)?'block-40px':'','dropblock']"></div>
    </div>
</div>
</template>

<script>
import { gsap } from "gsap";
export default {
  name: 'Template',
  data(){
      return {
          blockShow : [0,0,0,0,0,0,0,0,0],
          sideLength : 80,
      };
  },
  computed : {
      rowNum(){
          return 1+Math.floor(window.innerHeight/this.sideLength);
      },
      columnNum(){
          return 1+Math.floor(window.innerWidth*0.4/this.sideLength);
      },
      rows(){
          let array = [];
          for(let i=0;i<this.rowNum;i++){
              array.push({ key:i })
          }
          return array;
      },
      columns(){
          let array = [];
          for(let i=0;i<this.columnNum;i++){
              array.push({ key:i })
          }
          return array;
      },
  },
  methods : {
      loadScreenAnim(){
        for(let i=0;i<this.rowNum;i++){
            this.blockShow[i] = Math.round(Math.pow((i-this.rowNum/2)*2,2)/this.rowNum)
        }
        console.log(this.blockShow)
      },
      animeUpdate(){
        gsap.to('.block-in', {
            x:0,
            duration : 0.2,
            stagger : 0.05,
            ease : "ease-out"

            })
      }
  },
  mounted(){
      console.log(this.rowNum, this.columnNum)
      this.loadScreenAnim();

  },
  updated(){
      this.animeUpdate();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#container-dropblocks{
    right : 0px;
    width: 100vw;
    height: 100vh;
    position: absolute;
    overflow : hidden;
    display: flex;
    /* flex-direction: column; */
    flex-wrap: wrap;
    
}
.container-dropblocksrow{
    min-width: 100vw;
    height: 80px;
    display: flex;
    flex-direction: row-reverse;
}

.dropblock{
    min-width: 80px;
    background-color:#2759cc;
    transform: translate(1920px);
    box-shadow: -3px 3px 3px rgba(66, 66, 66, 0.16);
}

.dropblock:hover{
}

.container-40px{
    height: 40px;
}

.block-40px{
    height: 40px;
}

.block-in{

}

.block-out{

}


</style>
