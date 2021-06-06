

SETTING = {
    frameLength : 10,
    width : 30,
    height : 20,
    animationSpeed : 0.25,
    scale : 4,
    interval : 5,
    random : 0.8,
    hoverScale : 1.2,
    state : pause,

    AUTOSCALE : true,
}

const APP = {
    init : function(){
        this.game_frame = 0;

        //Create a Pixi Application
        this.app = new PIXI.Application({width: 1280, height: 720});
        const loader = PIXI.Loader.shared;
        this.app.stop();
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(this.app.view);

        //Set the canvas to full screen size
        this.app.renderer.view.style.position = "absolute";
        this.app.renderer.view.style.display = "block";
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(window.innerWidth*0.9, window.innerHeight);
        if(SETTING.AUTOSCALE) autoScale();

        //Load sprite sheet
        this.app.loader
                .add('spritesheet', './lifegame.json')
                .load(setup);
        },
    reset : function(){
        this.app.stop;
        if(SETTING.AUTOSCALE) autoScale();
        while(this.app.stage.children.length>0){
            this.app.stage.removeChild(this.app.stage.children[0]);
        }

        initAPP();
        this.app.start();
    },



}

APP.init();


function createAliveCell(textures, pos){

    //Function to create a live cell
    const cell = new PIXI.AnimatedSprite(textures);
    cell.x = pos.x * SETTING.frameLength * SETTING.scale;
    cell.y = pos.y * SETTING.frameLength * SETTING.scale;
    cell.animationSpeed = SETTING.animationSpeed;
    cell.scale.set(SETTING.scale);
    cell.gotoAndPlay(Math.random()*15);
    cell.visible = true;
    return cell;
}

function createDeadCell(pos){

    //Function to create a dead cell
    const cell = PIXI.Sprite.from(`lifegame-16.png`);
    cell.x = pos.x * SETTING.frameLength * SETTING.scale;
    cell.y = pos.y * SETTING.frameLength * SETTING.scale;
    cell.width = SETTING.frameLength * SETTING.scale;
    cell.height = SETTING.frameLength * SETTING.scale;
    cell.visible = false;
    return cell;
}

function createText(text, container, pos){
    const gametext = new PIXI.Text(text);
    gametext.position.set(pos.x,pos.y);
    gametext.style.fill = "white";
    container.addChild(gametext);
}

function setup() {

    initAPP();

    //
    state = SETTING.state;
    APP.app.ticker.add(delta => gameLoop(delta));
    
    // start animating
    APP.app.start();
    APP.game_frame = 0;
    controller.startControl(clicked, hovering, keyDown);
}

function initAPP(){
    //Initalize cell containers
    const deadCells = new PIXI.Container();
    const aliveCells = new PIXI.Container();
    APP.app.stage.addChild(aliveCells);
    APP.app.stage.addChild(deadCells);

    // create an array to store the live cell textures
    const aliveCellTextures = [];   
    for (let i = 0; i < 16; i++) {
        const texture_alive = PIXI.Texture.from(`lifegame-${i}.png`);
        aliveCellTextures.push(texture_alive);
    }

    //Fill up the container with cells
    for(let j=0; j<SETTING.height;j++){
        for(let i=0; i<SETTING.width;i++){
            aliveCells.addChild(createAliveCell(aliveCellTextures, {x:i,y:j}));
            deadCells.addChild(createDeadCell({x:i,y:j}));
        }
    }

    //Initalize Game Text
    const helpwords = new PIXI.Container();
    APP.app.stage.addChild(helpwords);
    createText("康威的生命游戏",helpwords,{x:window.innerWidth*0.7,y:50});
    createText("按Enter键开始/暂停演化",helpwords,{x:window.innerWidth*0.7,y:100});
    createText("按Back键清屏",helpwords,{x:window.innerWidth*0.7,y:150});
    createText("按R键随机放置活细胞",helpwords,{x:window.innerWidth*0.7,y:200});
    createText("按-/+键改变细胞密度",helpwords,{x:window.innerWidth*0.7,y:250});

    createText("暂停中",helpwords,{x:window.innerWidth*0.7,y:450});
    createText("游戏帧：    "+APP.game_frame,helpwords,{x:window.innerWidth*0.7,y:500});


    //Initalize Game Control
    APP.game = new GameControl(SETTING, aliveCells, deadCells);
}


function gameLoop(delta){
    state(delta);

}

function pause(delta){
    APP.app.stage.children[2].children[5].text = "暂停中";
}

function play(delta){
    APP.app.stage.children[2].children[5].text = "运行中";
    APP.app.stage.children[2].children[6].text = "游戏帧：    "+APP.game_frame;
    APP.game_frame++;
    if(APP.game_frame%SETTING.interval==0)APP.game.loop();

}

function clicked(x0, y0){
    let x = Math.floor(x0 / (SETTING.frameLength * SETTING.scale));
    let y = Math.floor(y0 / (SETTING.frameLength * SETTING.scale));
    if(x>=0 && x<SETTING.width && y>=0 && y<SETTING.height){
        APP.game.map[y* SETTING.width + x].changeStatus();
    }
}

function hovering(x0, y0, lasthover){
    let x = Math.floor(x0 / (SETTING.frameLength * SETTING.scale));
    let y = Math.floor(y0 / (SETTING.frameLength * SETTING.scale));
    currenthover = APP.game.map[y* SETTING.width + x];
    if(lasthover && currenthover != lasthover) {
        lasthover.nothovered();
    }
    if(x>=0 && x<SETTING.width && y>=0 && y<SETTING.height ){
        currenthover.hovered();
        return currenthover;
    }else{
        return false;
    }
}

function keyDown(keycode){
    if(keycode == 13){
        state == play ? state = pause : state = play;
    }

    if(keycode == 82){
        state = pause;
        APP.game.randomStatus();
    }
    if(keycode == 8){
        state = pause;
        APP.game.resetStatus();
    }
    if(keycode == 66){
        state = pause;
        APP.game.rebirthStatus();
    }
    if(keycode == 187){
        state = pause;
        if(SETTING.width < 90){
            SETTING.width+=3;
            SETTING.height+=2;
        }
        APP.reset();
    }
    if(keycode == 189){
        state = pause;
        if(SETTING.width >15){
            SETTING.width-=3;
            SETTING.height-=2;
        }
        APP.reset();
    }
}

function autoScale(){
    scale_x = window.innerWidth*0.8/ (SETTING.width * SETTING.frameLength);
    scale_y = window.innerHeight*0.9/ (SETTING.height * SETTING.frameLength);
    SETTING.scale = scale_x<scale_y ? scale_x : scale_y;
}


