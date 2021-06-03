class LifeGame{

    constructor(width,height){
        // initialize variables
        this.map = [];
        this.width=width;
        this.height=height;
        this.blocksize = 7;
        this.init();
    }

    init(){
        this.frame = 0;
        // initialize components
        this.initContext();
        this.initMap();
    }

    killAll(){
        for(let i=0;i<this.map.length;i++){
            for(let j=0;j<this.map[i].length;j++){
                this.map[i][j].setNextState(false);
                this.map[i][j].setCurrState(false);
            }
        }
        console.log(this.map)
    }

    initContext(){
        // initialize canvas context
        this.canvas = document.getElementById('c');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle='#333333';
        this.ctx.strokeStyle = '#333333'
        this.ctx.clearRect(0,0,this.width*this.blocksize,this.height*this.blocksize)
        this.ctx.lineWidth = .1;
    }

    initMap(){
        // initialize game blocks
        this.map = [];
        for(let i=0;i<this.width;i++){
            var row = [];
            for(let j=0;j<this.height;j++){
                row.push(new Life_Block(i,j,Math.random()>0.85,this.blocksize));
            }
            this.map.push(row);
        }
    }

    blocksNearby(lifeblock){
        let nearbyBlock=[];
        for(let i=-1;i<2;i++){
            for(let j=-1;j<2;j++){
                if(i!=0 || j!=0){
                    let x = lifeblock.position.x-i;
                    let y = lifeblock.position.y-j;
                    if(x<0){x+=this.width;}
                    if(y<0){y+=this.height;}
                    if(x>=this.width){x-=this.width;}
                    if(y>=this.height){y-=this.height;}
                    nearbyBlock.push(this.map[x][y]);
                }
            }
        }
        return nearbyBlock;
    }

    aliveBlockCount(lifeblock){
        let count=0;
        for(let i=0;i<this.blocksNearby(lifeblock).length;i++){
            if(this.blocksNearby(lifeblock)[i].isAlive()){
                count++;
            }
        }
        return count;
    }

    updateBlock(i,j){
        this.map[i][j].nextFrame(this.aliveBlockCount(this.map[i][j]));
    }

    updateBlocks(){
        for(let i=0;i<this.map.length;i++){
            for(let j=0;j<this.map[i].length;j++){
                this.updateBlock(i,j);
            }
        }
        for(let i=0;i<this.map.length;i++){
            for(let j=0;j<this.map[i].length;j++){
                this.map[i][j].nextFrame2();
            }
        }
    }

    paint(lifeblock){
        switch(lifeblock.isAlive()){
            case true:
                this.ctx.fillRect(lifeblock.position.x*this.blocksize,lifeblock.position.y*this.blocksize,this.blocksize,this.blocksize);
                break;
            case false:
                this.ctx.strokeRect(lifeblock.position.x*this.blocksize,lifeblock.position.y*this.blocksize,this.blocksize,this.blocksize);
                break;
        }
    }

    renderAll(){
        for(let i=0;i<this.map.length;i++){
            for(let j=0;j<this.map[i].length;j++){
                if(this.map[i][j].clicked()){
                    this.map[i][j].setCurrState(true);
                }
                this.paint(this.map[i][j]);
            }
        }
    }

    update(){
        this.updateBlocks();
    }

    loop(){
        this.frame+=1;
        if(GameofLife.clickGap>0){
            GameofLife.clickGap -= 1;
        }
        if(GameofLife.pause==false){
            this.update();
        }
        this.ctx.clearRect(0,0,this.width*this.blocksize,this.height*this.blocksize);
        document.getElementById("framecount").innerHTML="Current Frame: "+this.frame;
        this.renderAll();
    }
}

class Life_Block{
    constructor(x0,y0,boolean,blocksize){
        this.blocksize = blocksize;
        this.state = {
            currS : boolean,
            nextS : true
        };
        this.position = {
            x: x0,
            y: y0
        }
    }

    isAlive(){
        return this.state.currS;
    }

    setCurrState(state){
        this.state.currS = state;
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

    nextFrame(count){
        let upcomming = this.getNextS(count);
        this.setNextState(upcomming);
    }

    nextFrame2(){
        this.setCurrState(this.state.nextS);
    }

    clicked(){
        // function to detect whether the component is clicked by the user

        let myleft = this.position.x * this.blocksize;
        let mytop = this.position.y * this.blocksize;
        let myright = myleft + this.blocksize;
        let mybottom = mytop + this.blocksize;
        let clicked = true;
        if ((mybottom < GameofLife.y) || (mytop > GameofLife.y) || (myright < GameofLife.x) || (myleft > GameofLife.x)) {
            clicked = false;
            if(this.position.x==0 && this.position.y==0){
            }
        }
        if(GameofLife.clickGap>0){
            clicked = false;
            if(this.position.x==0 && this.position.y==0){
            }
        }
        if (clicked == true){
            GameofLife.clickGap = 5;
        }
        return clicked;
    }
}

var controller = {
    // controller of the game

    startControl : function(){
        window.addEventListener('mousedown', function (e) {
            GameofLife.x = e.pageX-10;                // deduct the top and left margin of the canvas
            GameofLife.y = e.pageY-10;
            console.log(GameofLife.x);
            console.log(GameofLife.y);
        })
        window.addEventListener('mouseup', function (e) {
            GameofLife.x = -1;
            GameofLife.y = -1;
            console.log("reset to 0")
        })
        window.addEventListener('touchstart', function (e) {
            GameofLife.x_touch = e.pageX-10;
            GameofLife.y_touch = e.pageY-10;
        })
        window.addEventListener('touchend', function (e) {
            GameofLife.x_touch = false;
            GameofLife.y_touch = false;
        })
        window.addEventListener('mousemove', function (e) {
            GameofLife._x = e.pageX-10;
            GameofLife._y = e.pageY-10;
        })
    }
}

var GameofLife = {
    game : new LifeGame(120,100),
    pause : true,
    alert : function(){
        console.log(this);
    },
    loop : function(){
        this.x = -1;
        this.y = -1;
        this._x = -1;
        this._y = -1;
        this.interval = setInterval(() => {
            this.game.loop();
        }, 160);
    },
    stop : function(){
        clearInterval(this.interval);
        this.pause = true;
    },
    clear : function(){
        this.pause=true;
        this.game.init();
        this.game.killAll();
    },
    start : function(){
        this.x = -1;
        this.y = -1;
        this.pause = false;
        this.interval = setInterval(() => {
            this.game.loop()
        }, 160);
    },
    random : function(){
        this.game.init();
    },
    nextFrame : function(){
        clearInterval(this.interval);
        this.pause=false;
        this.game.loop();
    }
}

GameofLife.loop();
controller.startControl();