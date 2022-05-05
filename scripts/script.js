var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
let player_width = 140;
let player_height = 88;
canvas.width = 960;
canvas.height = 480;
//document.getElementById("mainCanvas").appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
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
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
    playerReady = true;
};
playerImage.src = "ressources/images/game_object/player_140px.png";

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if(playerReady){
        ctx.drawImage(playerImage, player.x, player.y);
    }
}

let player = new Player(canvas.width/2-player_width/2, canvas.height/2);

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    //update(delta / 1000);
    //console.log(delta);
    render();


    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame
    || w.webkitRequestAnimationFrame
    || w.msRequestAnimationFrame
    || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
//reset();
main();

