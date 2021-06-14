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
            Math.random()>this.setting.random ? this.map[i].absAlive() : this.map[i].absDead();
        }
    }

    initMap(){
        // initialize game blocks
        this.map = [];
        for(let j=0;j<this.h;j++){
            for(let i=0;i<this.w;i++){
                this.map.push(new Life_Block(i,j,false, this.cellcontainer, this.setting));
            }
        }
    }

    aliveBlockCount(lifeblock){
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
        let i;
        for(i=0;i<this.map.length;i++){
            this.map[i].updateNextState(this.aliveBlockCount(this.map[i]))
        }

        for(i=0;i<this.map.length;i++){
            this.map[i].updateCurrState();
        }
    }

    loop(){
        this.updateBlocks();
    }
}


class Life_Block{
    constructor(x0,y0,boolean, cellcontainer, setting){
        this.state = {
            currS : boolean,
            nextS : true
        };
        this.position = {
            x: x0,
            y: y0
        }
        this.setting = setting;
        this.cell = cellcontainer.children[x0+y0*setting.width];
        
        if(boolean){
            this.cell.tint = hexFade(this.setting.color.green, 1)
        }else{
            this.cell.tint = this.setting.color.green;
        }
        this.deadframe = setting.deadframe;
        this.aliveframe = setting.aliveframe;
    }
    changeStatus(){
        if(this.isAlive()){
            this.absDead();
        }else{
            this.absAlive();
        }
    }

    showingCell(){
        return this.isAlive() ? this.alivecell : this.deadcell;
    }

    isAlive(){
        return this.state.currS;
    }

    willAlive(){
        return this.state.nextS;
    }

    goAlive(){  
        this.state.currS = true;
        this.deadframe = this.setting.deadframe;
        if(this.aliveframe>0) this.aliveframe-=1;
        this.cell.tint = hexdelight(this.setting.color.green, this.aliveframe/this.setting.aliveframe/1);
    }

    goDead(){
        this.state.currS = false;
        this.aliveframe = this.setting.aliveframe;
        if(this.deadframe>0) this.deadframe-=1;
        this.cell.tint = hexFade(this.setting.color.blue, this.deadframe/this.setting.deadframe/1);
    }

    absDead(){
        this.state.currS = false;
        this.deadframe = 0;
        this.aliveframe = this.setting.aliveframe;
        this.cell.tint = hexFade(this.setting.color.blue, this.deadframe/this.setting.deadframe);
    }

    absAlive(){
        this.state.currS = true;
        this.aliveframe = this.setting.aliveframe;
        this.cell.tint = hexdelight(this.setting.color.green, this.aliveframe/this.setting.aliveframe);
    }

    hovered(){


    }

    nothovered(){

    }

    setNextState(state){
        this.state.nextS = state;
    }

    getNextS(count){
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
        this.setNextState(this.getNextS(count));
    }

    updateCurrState(){
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
    startControl : function(clicked, hovering, keyDown){
        window.addEventListener('mousedown', function (e) {
            this.x = e.pageX;                // deduct the top and left margin of the canvas
            this.y = e.pageY;
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
            this._x = e.pageX;
            this._y = e.pageY;
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
    let red = Math.floor(hex/65536);
    let green = Math.floor((hex - red*65536)/256);
    let blue = Math.floor(hex - red*65536 - green*256); 

    return Math.floor(red*para)*65536+Math.floor(green*para)*256+Math.floor(blue*para)*1;
}


function hexdelight(hex, para){
    let red = 255-Math.floor((255-hex2Array(hex)[0])*para)
    let green = 255-Math.floor((255-hex2Array(hex)[1])*para)
    let blue = 255-Math.floor((255-hex2Array(hex)[2])*para)

    return Math.floor(red)*65536+Math.floor(green)*256+Math.floor(blue)*1;
}

function hex2Array(hex){
    let red = Math.floor(hex/65536);
    let green = Math.floor((hex - red*65536)/256);
    let blue = Math.floor(hex - red*65536 - green*256); 

    return [red,green,blue];
}

