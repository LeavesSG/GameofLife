class GameControl{

    constructor(setting, alivecellcontainer, deadcellcontainer){
        // initialize variables
        this.setting = setting
        this.map = [];
        this.w=setting.width;
        this.h=setting.height;
        this.blocksize = 10;
        this.alivecellcontainer = alivecellcontainer;
        this.deadcellcontainer = deadcellcontainer;

        // initialize game map
        this.initMap();
    }


    resetStatus(){
        //reset all block status to false
        for(let i=0;i<this.map.length;i++){
                this.map[i].goDead();
            }
    }

    rebirthStatus(){
        //reset all block status to false
        for(let i=0;i<this.map.length;i++){
                this.map[i].goAlive();
            }
    }

    randomStatus(){
        //reset all block status to false
        for(let i=0;i<this.map.length;i++){
            Math.random()>this.setting.random ? this.map[i].goAlive() : this.map[i].goDead();
        }
    }

    initMap(){
        // initialize game blocks
        this.map = [];
        for(let j=0;j<this.h;j++){
            for(let i=0;i<this.w;i++){
                this.map.push(new Life_Block(i,j,false, this.alivecellcontainer, this.deadcellcontainer, this.setting));
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
    constructor(x0,y0,boolean,aliveCellContainer, deadCellContainer, setting){
        this.state = {
            currS : boolean,
            nextS : true
        };
        this.position = {
            x: x0,
            y: y0
        }
        this.setting = setting;
        this.alivecell = aliveCellContainer.children[x0+y0*setting.width];
        this.deadcell = deadCellContainer.children[x0+y0*setting.width];
        
        if(boolean){
            this.alivecell.visible = true;
            this.deadcell.visible = false;
        }else{
            this.alivecell.visible = false;
            this.deadcell.visible = true;
        }
        this.moved = false;
    }
    changeStatus(){
        if(this.isAlive()){
            this.goDead();
        }else{
            this.goAlive();
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
        this.alivecell.visible = true;
        this.deadcell.visible = false;
    }

    goDead(){
        this.state.currS = false;
        this.alivecell.visible = false;
        this.deadcell.visible = true;
    }

    hovered(){
        this.alivecell.scale.set(this.setting.hoverScale*this.setting.scale);
        this.deadcell.scale.set(this.setting.hoverScale*this.setting.scale);
        if(!this.moved){
            this.alivecell.x -= SETTING.frameLength*(this.setting.hoverScale-1)*0.5*SETTING.scale;
            this.alivecell.y -= SETTING.frameLength*(this.setting.hoverScale-1)*0.5*SETTING.scale;
            this.deadcell.x -= SETTING.frameLength*(this.setting.hoverScale-1)*0.5*SETTING.scale;
            this.deadcell.y -= SETTING.frameLength*(this.setting.hoverScale-1)*0.5*SETTING.scale;
            this.moved = true;
        }

    }

    nothovered(){
        this.alivecell.scale.set(this.setting.scale);
        this.deadcell.scale.set(this.setting.scale);
        if(this.moved){
            this.alivecell.x += SETTING.frameLength*(this.setting.hoverScale-1)*0.5*SETTING.scale;
            this.alivecell.y += SETTING.frameLength*(this.setting.hoverScale-1)*0.5*SETTING.scale;
            this.deadcell.x += SETTING.frameLength*(this.setting.hoverScale-1)*0.5*SETTING.scale;
            this.deadcell.y += SETTING.frameLength*(this.setting.hoverScale-1)*0.5*SETTING.scale;
            this.moved = false;
        }
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
        })
        window.addEventListener('keyup', function (a) {
            this.key = false;
        })
    }

    
}