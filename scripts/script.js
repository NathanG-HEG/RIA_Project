const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

const player_width = 140;
const player_height = 88;
const player_max_health = 1000;
const player_projectiles = [];
const projectiles_speed = 10;
const projectileDelayMs = 250;
let readyToShoot = true;
let lastShot = Date.now();
let player_health = player_max_health;
canvas.width = 960;
canvas.height = 480;
const playerSpeed = 5;
let activeKeys = [];

//enemies
const smallEnemyWidth = 28;
const smallEnemyHeight = 25;
const smallEnemies = [];
const smallEnemySpeed = 4;

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
const playerImage = new Image();
playerImage.onload = function () {
    playerReady = true;
};
playerImage.src = "ressources/images/game_object/player_140px.png";

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
    if (activeKeys['shootLeft'] && readyToShoot) {
        //shoot
        player_health -= 2;
        player_projectiles[player_projectiles.length] = new Projectile(this.x, this.y+player_height/2, true);
        lastShot = Date.now();
    }
    if (activeKeys['shootRight'] && readyToShoot) {
        //shoot
        player_health -= 2;
        player_projectiles[player_projectiles.length] = new Projectile(this.x + player_width-10, this.y+player_height/2, false);
        lastShot = Date.now();
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

// Projectile
let Projectile = function (x, y, left) {
    this.left = left;
    this.x = x;
    this.y = y;
}

let projectileReady = false;
const projectileImage = new Image();
projectileImage.onload = function () {
    projectileReady = true;
};
projectileImage.src = "ressources/images/game_object/projectile_10x2.png";

Projectile.prototype.draw = function (pos) {
    if (this.left) this.x -= projectiles_speed;
    else this.x += projectiles_speed;

    // projectile clamp
    if (this.x < 0) {
        player_projectiles.splice(pos, 1);
    }
    if (this.y < 0) {
        player_projectiles.splice(pos, 1);
    }
    if (this.x > canvas.width) {
        player_projectiles.splice(pos, 1);
    }
    if (this.y > canvas.height) {
        player_projectiles.splice(pos, 1);
    }
}


// Small enemies
let SmallEnemy = function (x, y, left, up) {
    this.left = left;
    this.up = up;
    this.x = x;
    this.y = y;
}

let smallEnemyReady = false;
const smallEnemyImage = new Image();
smallEnemyImage.onload = function () {
    smallEnemyReady = true;
};
smallEnemyImage.src = "ressources/images/game_object/small_enemy_28px.png";

SmallEnemy.prototype.draw= function(pos){

    // enemy movement
    if(this.left){
        this.x -= smallEnemySpeed;
    }else{
        this.x += smallEnemySpeed;
    }
    if(this.up){
        this.y -= smallEnemySpeed;
    }else{
        this.y += smallEnemySpeed;
    }

    // enemy collision
    if(collisionSmallEnemy(player, this)) {
        player_health -= 300;
        smallEnemies.splice(pos, 1);
    }

    // enemy clamp
    if (this.x < 0) {
        this.left = !this.left;
    }
    if (this.y < 0) {
        this.up = !this.up;
    }
    if (this.x + smallEnemyWidth > canvas.width) {
        this.left = !this.left;
    }
    if (this.y + smallEnemyHeight > canvas.height) {
        this.up = !this.up;
    }
}

// Draw everything
let render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (playerReady) {
        ctx.drawImage(playerImage, player.x, player.y);
    }
    for (let i = 0; i < player_projectiles.length; i++) {
        if (projectileReady) {
            ctx.drawImage(projectileImage, player_projectiles[i].x, player_projectiles[i].y);
            player_projectiles[i].draw(i);
        }
    }
    for (let i = 0; i < smallEnemies.length; i++) {
        if (smallEnemyReady) {
            ctx.drawImage(smallEnemyImage, smallEnemies[i].x, smallEnemies[i].y);
            smallEnemies[i].draw(i);
        }
    }

    // Health bar
    ctx.fillStyle = '#CCC';
    ctx.beginPath();
    ctx.rect(20, 20, 300, 20);
    ctx.fill();
    // Current health
    let r = 100;
    let g = 194;
    let b = 168;
    let z = player_health / player_max_health
    ctx.fillStyle = rgb(r, g * z, b * z);
    ctx.beginPath();
    ctx.rect(20, 20, 300 * z, 20);
    ctx.fill();
}

function rgb(r, g, b) {
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    return ["rgb(", r, ",", g, ",", b, ")"].join("");
}

function collisionSmallEnemy(player, a){
    return (player.x < a.x + smallEnemyWidth &&
        player.x + player_width > a.x &&
        player.y < a.y + smallEnemyHeight &&
        player_height+ player.y > a.y);
}


// The main game loop
let main = function () {
    let now = Date.now();
    let delta = now - then;
    //update(delta / 1000);
    //console.log(delta);

    readyToShoot = lastShot + projectileDelayMs < now;

    player.draw();
    render();
    then = now;

    /* ### debug ### */

    if (player_health < 0) {
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
/* ### DEBUG ### */
for(let i = 0; i<5;i++){
    let x = Math.random()*canvas.width;
    let y = Math.random()*canvas.height;
    smallEnemies[i] = new SmallEnemy(x, y, x%2===0, y%2===0)
}
/* ### END DEBUG ### */
main();

