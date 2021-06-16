/*============================================*/ 
/*================GAME CONTROL================*/ 
/*============================================*/ 



class GameControl{

    constructor(setting, cellcontainer){
        // initialize variables
        this.setting = setting
        this.map = [];
        this.w=setting.width;
        this.h=setting.height;
        this.blocksize = 10;
        this.cellcontainer = cellcontainer;

        // initialize game map
        this.initMap();

        this.livecount = 0;
    }


    resetStatus(){
        //reset all block status to false
        for(let i=0;i<this.map.length;i++){
                this.map[i].absDead();
            }
    }

    rebirthStatus(){
        //reset all block status to false
        for(let i=0;i<this.map.length;i++){
                this.map[i].absAlive();
            }
    }

    randomStatus(){
        //reset all block status to false   
        for(let i=0;i<this.map.length;i++){
            Math.random()>this.setting.spawnrate ? this.map[i].absAlive() : this.map[i].absDead();
        }
    }

    initMap(){
        // initialize game blocks
        this.map = [];
        for(let j=0;j<this.h;j++){
            for(let i=0;i<this.w;i++){
                this.map.push(new Life_Block(i,j, this.cellcontainer, this.setting));
            }
        }
        for(let i=0;i<this.map.length;i++){
            OPEN_SCREEN.data[i]==1 ? this.map[i].absAlive() : this.map[i].absDead();
        }
    }

    aliveBlockCount(lifeblock){
        // return the number of alive cells nearby a given cell
        let count = 0;
        for(let i=-1;i<2;i++){
            for(let j=-1;j<2;j++){
                if(i!=0 || j!=0){
                    let x = lifeblock.position.x-i;
                    let y = lifeblock.position.y-j;
                    if(x<0){x+=this.w;}
                    if(y<0){y+=this.h;}
                    if(x>=this.w){x-=this.w;}
                    if(y>=this.h){y-=this.h;}
                    if(this.map[x+y*this.w].isAlive()){
                        count++;
                    }
                }
            }
        }
        return count;
    }

    updateBlocks(){
        //normally update each block on the screen
        let i;
        for(i=0;i<this.map.length;i++){
            this.map[i].updateNextState(this.aliveBlockCount(this.map[i]))
        }

        for(i=0;i<this.map.length;i++){
            this.map[i].updateCurrState();
        }

    }

    getAliveNums(){
        //return the number of alive cells
        this.livecount=0;
        for(let i=0;i<this.map.length;i++){
            if(this.map[i].isAlive()) this.livecount+=1;
        }
        return this.livecount;
    }

    loop(){
        //game loop function 
        this.updateBlocks();
    }
}







/*============================================*/ 
/*=================LIFE BLOCK=================*/ 
/*============================================*/ 







class Life_Block{
    constructor(x0,y0, cellcontainer, setting){
        this.state = {//determine wheather the block is alive or dead 
            currS : true,
            nextS : false
        };
        this.position = { //position on the map grid 
            x: x0,
            y: y0
        }
        //inherit the game setting
        this.setting = setting;

        //connect with the display sprites
        this.cell = cellcontainer.children[x0+y0*setting.width];
        
        //props to control alive/dead animations
        this.deadframe = setting.deadframe;
        this.aliveframe = 0;

        this.display();


    }

    changeStatus(){
        //reverse the current alive state
        if(this.isAlive()){
            this.absDead();
        }else{
            this.absAlive();
        }
    }

    isAlive(){
        return this.state.currS;
    }

    willAlive(){
        return this.state.nextS;
    }

    display(para = 1){
        //change the bg-color of the related sprite based on alive state
        if(this.isAlive()){
            this.cell.tint = hexdelight(this.setting.color.green, 0.15*this.aliveframe/this.setting.aliveframe+0.85);
        }else{
            this.cell.tint = hexFade(this.setting.color.blue, this.deadframe/this.setting.deadframe/para);
        }
    }

    goAlive(){
        // go alive (with anim)
        this.state.currS = true;
        this.deadframe = this.setting.deadframe;
        if(this.aliveframe<this.setting.aliveframe) this.aliveframe+=1;
        this.display();
    }

    goDead(){
        // go dead with anim
        this.state.currS = false;
        this.aliveframe = 0;
        if(this.deadframe>0) this.deadframe-=1;
        this.display()
    }

    absDead(){
        // go dead without animation(without body)
        this.state.currS = false;
        this.deadframe = 0;
        this.aliveframe = this.setting.aliveframe;
        this.cell.tint = hexFade(this.setting.color.blue, this.deadframe/this.setting.deadframe);
    }

    absAlive(){
        // go alive without animation(without stable signal)
        this.state.currS = true;
        this.aliveframe = 0;
        this.cell.tint = hexdelight(this.setting.color.green, 0.15*this.aliveframe/this.setting.aliveframe+0.85);
    }

    hovered(){
        // changed color of the cell is hovered by the cursor
        if(this.isAlive()){
            this.cell.tint = 0xaaaaaa;
        }else{
            this.cell.tint = 0xcccccc;
        }
    }

    nothovered(){
        // remove the hover effect
        this.display();
    }

    setNextState(state){
        // private method to change the state
        this.state.nextS = state;
    }

    getNextS(count){
        // calculate the alive state with given bg
        if(this.isAlive()){
            if(count==2||count==3){
                return true;
            }else{
                return false;
            }
            
        }else{
            if(count==3){
                return true;
            }else{
                return false;
            }
        }
    }

    updateNextState(count){
        // update next state
        this.setNextState(this.getNextS(count));
    }

    updateCurrState(){
        // update current state
        if(this.willAlive()){
            this.goAlive();
        }else{
            this.goDead();
        }
    }
    
}

var controller = {
    // controller of the game
    clickInterval : 0,
    _x : 0,
    _y : 0,
    currHovering : false,

    startControl : function(clicked, hovering, keyDown, setting){
        window.addEventListener('mousedown', function (e) {
            this.x = e.pageX - setting.window.width * setting.leftpedding;                // deduct the top and left margin of the canvas
            this.y = e.pageY - setting.window.height*0.08 - setting.window.height * setting.toppedding;
            clicked(this.x,this.y);
        })
        window.addEventListener('mouseup', function (e) {
            this.x = -1;
            this.y = -1;
        })
        window.addEventListener('touchstart', function (e) {
            this.x_touch = e.pageX;
            this.y_touch = e.pageY;
        })
        window.addEventListener('touchend', function (e) {
            this.x_touch = false;
            this.y_touch = false;
        })
        window.addEventListener('mousemove', function (e) {
            this._x = e.pageX - setting.window.width * setting.leftpedding;
            this._y = e.pageY - setting.window.height*0.08 - setting.window.height * setting.toppedding;
            this.currHovering = hovering(this._x,this._y, this.currHovering);
            
        })
        window.addEventListener('keydown', function (a) {
            this.key = a.keyCode;
            keyDown(this.key);
            console.log("输入键值："+this.key)
            console.log(hexFade(0xffffff,0.5))
        })
        window.addEventListener('keyup', function (a) {
            this.key = false;
        })
    }

    
}

function hexFade(hex, para){
    // return darker color of a given hex-value
    let red = Math.floor(hex/65536);
    let green = Math.floor((hex - red*65536)/256);
    let blue = Math.floor(hex - red*65536 - green*256); 

    return Math.floor(red*para)*65536+Math.floor(green*para)*256+Math.floor(blue*para)*1;
}


function hexdelight(hex, para){
    // return brighter color of a given hex-value
    let red = 255-Math.floor((255-hex2Array(hex)[0])*para)
    let green = 255-Math.floor((255-hex2Array(hex)[1])*para)
    let blue = 255-Math.floor((255-hex2Array(hex)[2])*para)

    return Math.floor(red)*65536+Math.floor(green)*256+Math.floor(blue)*1;
}

function hex2Array(hex){
    //convert hex value to array
    let red = Math.floor(hex/65536);
    let green = Math.floor((hex - red*65536)/256);
    let blue = Math.floor(hex - red*65536 - green*256); 

    return [red,green,blue];
}

