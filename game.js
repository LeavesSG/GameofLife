

SETTING = {
    frameLength : 10,       // the init length of each cell 
    width : 80,             // number of cells in a row
    height : 60,            // number of cells in a column
    animationSpeed : 0.10,  // animation speed for gif based sprites(not used any more!)
    scale : 4,              // multiplier for the cell size
    interval : 5,           // frame intervals between every to screen update
    spawnrate : 0.8,        // used for random spawn
    hoverScale : 1.2,       // cell re-scale when hovering(not used any more!)
    deadframe : 64,         // frames dead body remains 
    aliveframe :32 ,         // frames alive cell turns stable
    leftpedding : 0.05,     // left padding of the screen
    toppedding : 0.04,      // right pedding of the screen
    
    color: {                // color used to represent the cell status
        green : 0x008800,   
        blue : 0x37474f,    
    },

    AUTOSCALE : true,       // wheather the cell size will re-scale with the window
    state : pause,          // game initial state
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
        this.app.renderer.backgroundColor = 0x212121;
        this.app.renderer.autoResize = true;
        this.app.renderer.resize(window.innerWidth, window.innerHeight*.92);
        SETTING.window = {width: window.innerWidth, height : window.innerHeight};
        if(SETTING.AUTOSCALE) autoScale();

        //Load sprite sheet
        this.app.loader
                .add('spritesheet', './lifegame.json')
                .load(setup);
        },

    reset : function(){
        // remove the children of the app stage and forced re-scale
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

function createCell(pos){
    // create a cell on map with given location
    let rectangle = new PIXI.Graphics();
    // rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0xFFFFFF)
    rectangle.lineStyle(Math.floor(SETTING.frameLength/4), 0xeeeeeee, 1);
    rectangle.drawRect(0, 0, 10*SETTING.scale, 10*SETTING.scale);
    rectangle.endFill();
    rectangle.x = pos.x * SETTING.frameLength * SETTING.scale + SETTING.window.width * SETTING.leftpedding;
    rectangle.y = pos.y * SETTING.frameLength * SETTING.scale + SETTING.window.height * SETTING.toppedding;
    return rectangle;
}

function createText(text, container, pos){
    // create a text object
    const gametext = new PIXI.Text(text);
    gametext.style.fontFamily= "sans-serif";
    gametext.position.set(pos.x,pos.y);
    gametext.style.fill = "white";
    gametext.style.dropShadow = true,
    gametext.style.dropShadowColor= "#000000",
    gametext.style.dropShadowBlur= 4,
    gametext.style.dropShadowAngle= Math.PI / 6,
    gametext.style.dropShadowDistance= 6,
    container.addChild(gametext);
}

function setup() {
    initAPP();
    // ticker basic settings
    state = SETTING.state;
    APP.app.ticker.add(delta => gameLoop(delta));
    
    // start simulating
    APP.app.start();
    APP.game_frame = 0;
    controller.startControl(clicked, hovering, keyDown, SETTING);
}

function initAPP(){
    //Initalize cell containers

    const cells = new PIXI.Container();

    APP.app.stage.addChild(cells);

    //Fill up the container with cells
    for(let j=0; j<SETTING.height;j++){
        for(let i=0; i<SETTING.width;i++){
            cells.addChild(createCell({x:i,y:j}));
        }
    }

    //Initalize Game Text
    const helpwords = new PIXI.Container();
    APP.app.stage.addChild(helpwords);
    createText("Conway's Game of Life",helpwords,{x:window.innerWidth*0.65,y:50});
    createText("Press ENTER to start/pause simulation",helpwords,{x:window.innerWidth*0.65,y:100});
    createText("Press DELETE to clear the screen",helpwords,{x:window.innerWidth*0.65,y:150});
    createText("Press R to randomly respawn the cells",helpwords,{x:window.innerWidth*0.65,y:200});
    createText("Press +/- to rescale",helpwords,{x:window.innerWidth*0.65,y:250});

    createText("PAUSE",helpwords,{x:window.innerWidth*0.65,y:450});
    createText("Game Frame：    "+APP.game_frame,helpwords,{x:window.innerWidth*0.65,y:500});
    createText("Alive cell count:  "+APP.game_frame,helpwords,{x:window.innerWidth*0.65,y:550});


    //Initalize Game Control
    APP.game = new GameControl(SETTING, cells);
}


function gameLoop(delta){
    state(delta);

}

function pause(delta){
    APP.app.stage.children[1].children[5].text = "PAUSE";
    APP.app.stage.children[1].children[7].text = "Alive cell count:  "+APP.game.getAliveNums();
}

function play(delta){
    APP.app.stage.children[1].children[5].text = "Simulating";
    APP.app.stage.children[1].children[6].text = "Game Frame：    "+APP.game_frame;
    APP.app.stage.children[1].children[7].text = "Alive cell count:  "+APP.game.getAliveNums();
    APP.game_frame++;
    if(APP.game_frame%SETTING.interval==0)APP.game.loop();

}

function clicked(x0, y0){
    // method when a cell is clicked
    let x = Math.floor(x0 / (SETTING.frameLength * SETTING.scale));
    let y = Math.floor(y0 / (SETTING.frameLength * SETTING.scale));
    if(x>=0 && x<SETTING.width && y>=0 && y<SETTING.height){
        APP.game.map[y* SETTING.width + x].changeStatus();
    }
}

function hovering(x0, y0, lasthover){
    // method when a cell is hovering
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
    // keyboard control
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
        APP.game.randomStatus();
    }
    if(keycode == 189){
        state = pause;
        if(SETTING.width >15){
            SETTING.width-=3;
            SETTING.height-=2;
        }
        APP.reset();
        APP.game.randomStatus();
    }
}

function autoScale(){
    scale_x = window.innerWidth*0.8/ (SETTING.width * SETTING.frameLength);
    scale_y = window.innerHeight*0.85/ (SETTING.height * SETTING.frameLength);
    SETTING.scale = scale_x<scale_y ? scale_x : scale_y;
}