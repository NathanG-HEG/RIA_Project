const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

const player_width = 140;
const player_height = 88;
const player_max_health = 1000;
let player_health = player_max_health;
canvas.width = 960;
canvas.height = 480;
const playerSpeed = 5;
let activeKeys = [];

// Background image
let bgReady = false;
const bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "ressources/images/game_object/star_background_960x480.jpg";

// Player
let Player = function (x, y) {
    this.x = x;
    this.y = y;
};
// Player image
let playerReady = false;
let playerImage = new Image();
playerImage.onload = function () {
    playerReady = true;
};
playerImage.src = "ressources/images/game_object/player_140px.png";

// Draw everything
let render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (playerReady) {
        ctx.drawImage(playerImage, player.x, player.y);
    }
    // Health bar
    ctx.fillStyle = '#CCC';
    ctx.beginPath();
    ctx.rect(20, 20, 300, 20);
    ctx.fill();
    // Current health
    ctx.fillStyle = rgb(0, player_health/10+125, 0);
    ctx.beginPath();
    ctx.rect(20, 20, 300*player_health/player_max_health, 20);
    ctx.fill();
}

function rgb(r, g, b){
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    if(r>255) r = 255;
    return ["rgb(",r,",",g,",",b,")"].join("");
}

let player = new Player(canvas.width / 2 - player_width / 2, canvas.height / 2);

Player.prototype.draw = function () {
    if (activeKeys['left']) {
        this.x -= playerSpeed;
    }
    if (activeKeys['right']) {
        this.x += playerSpeed;
    }
    if (activeKeys['up']) {
        this.y -= playerSpeed;
    }
    if (activeKeys['down']) {
        this.y += playerSpeed;
    }
    if (activeKeys['shootLeft']) {
        //shoot
        player_health-=2;
    }
    if(activeKeys['shootRight']){
        //shoot
        player_health-=2;
    }
    // player clamp
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.x + player_width > canvas.width) {
        this.x = canvas.width - player_width;
    }
    if (this.y + player_height > canvas.height) {
        this.y = canvas.height - player_height;
    }
}
// The main game loop
let main = function () {
    let now = Date.now();
    let delta = now - then;
    //update(delta / 1000);
    //console.log(delta);
    player.draw();
    render();
    then = now;

    /* ### debug ### */
    if(player_health<0){
        player_health = player_max_health;
    }
    /* ### end debug ### */
    // Request to do this again ASAP
    requestAnimationFrame(main);
};

function setKeysTo(e, state) {
    if (e.keyCode === 37 || e.keyCode === 65) {
        activeKeys['left'] = state;
    } else if (e.keyCode === 39 || e.keyCode === 68) {
        activeKeys['right'] = state;
    } else if (e.keyCode === 38 || e.keyCode === 87) {
        activeKeys['up'] = state;
    } else if (e.keyCode === 40 || e.keyCode === 83) {
        activeKeys['down'] = state;
    } else if (e.keyCode === 81 || e.keyCode === 74) {
        activeKeys['shootLeft'] = state;
    } else if (e.keyCode === 69 || e.keyCode === 75) {
        activeKeys['shootRight'] = state;
    }
    return false;
}

document.onkeydown = function (e) {
    return setKeysTo(e, true);
};

document.onkeyup = function (e) {
    return setKeysTo(e, false);
};

// Cross-browser support for requestAnimationFrame
let w = window;
requestAnimationFrame = w.requestAnimationFrame
    || w.webkitRequestAnimationFrame
    || w.msRequestAnimationFrame
    || w.mozRequestAnimationFrame;

// Let's play this game!
let then = Date.now();
//reset();
main();

