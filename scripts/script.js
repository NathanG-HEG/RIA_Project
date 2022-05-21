const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

gameOver = false;
let score = 0;
let level = 0;

const player_width = 140;
const player_height = 88;
const player_max_health = 1000;
const player_projectiles = [];
const projectiles_speed = 15;
const projectileDelayMs = 250;
const projectileWidth = 10;
const projectileHeight = 2;
let readyToShoot = true;
let lastShot = Date.now();
let player_health = player_max_health;
canvas.width = 960;
canvas.height = 720;
const playerSpeed = 5;
let activeKeys = [];

//Healing point
const healingPerPoint = 333;
const healingPointWidth = 49;
const healingPointHeight = 45;
let healingPoint = null;

//enemies
const smallEnemyWidth = 28;
const smallEnemyHeight = 25;
const enemies = [];
const smallEnemySpeed = 3;
const smallEnemyDamage = 200;

// Background image
let bgReady = false;
const bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "ressources/images/game_object/star_background_960x720.jpg";

// Player
let Player = function (x, y) {
    this.x = x;
    this.y = y;
};
// Player image
let playerReady = false;
const playerImage = new Image();

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
        player_projectiles[player_projectiles.length] = new Projectile(this.x, this.y + player_height / 2, true);
        lastShot = Date.now();
    }
    if (activeKeys['shootRight'] && readyToShoot) {
        //shoot
        player_health -= 2;
        player_projectiles[player_projectiles.length] = new Projectile(this.x + player_width - 10, this.y + player_height / 2, false);
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

// Healing point
let healingPointReady = false;
const healingPointImage = new Image();

let HealingPoint = function (x, y) {
    this.x = x;
    this.y = y;
    healingPointImage.onload = function () {
        healingPointReady = true;
    }
    healingPointImage.src = "ressources/images/game_object/healing_point_45px.png";
}

HealingPoint.prototype.draw = function () {
    if (healingPointCollidePlayer(player, this)) {
        if (player_health + healingPerPoint < player_max_health) {
            player_health += healingPerPoint;
        } else {
            player_health = player_max_health;
        }
        healingPoint = null;
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

SmallEnemy.prototype.draw = function (pos) {

    // enemy movement
    if (this.left) {
        this.x -= smallEnemySpeed;
    } else {
        this.x += smallEnemySpeed;
    }
    if (this.up) {
        this.y -= smallEnemySpeed;
    } else {
        this.y += smallEnemySpeed;
    }

    // enemy collision
    //  with player
    if (enemyCollidePlayer(player, this)) {
        player_health -= smallEnemyDamage;
        enemies.splice(pos, 1);
    }
    // with projectile
    for (let i = 0; i < player_projectiles.length; i++) {
        if (enemyCollideProjectile(player_projectiles[i], this)) {
            score++;
            enemies.splice(pos, 1);
        }
    }

    // enemy clamp
    if (this.x < 1) {
        this.left = false;
    }
    if (this.y < 1) {
        this.up = false;
    }
    if (this.x + smallEnemyWidth > canvas.width) {
        this.left = true;
    }
    if (this.y + smallEnemyHeight > canvas.height) {
        this.up = true;
    }
}

// Collisions functions

function healingPointCollidePlayer(player, a) {
    return (player.x < a.x + healingPointWidth &&
        player.x + player_width > a.x &&
        player.y + 30 < a.y + healingPointHeight &&
        player_height + player.y - 10 > a.y);
}

function enemyCollidePlayer(player, a) {
    return (player.x < a.x + smallEnemyWidth &&
        player.x + player_width > a.x &&
        player.y + 30 < a.y + smallEnemyHeight &&
        player_height + player.y - 10 > a.y);
}

function enemyCollideProjectile(projectile, a) {
    return (projectile.x < a.x + smallEnemyWidth &&
        projectile.x + projectileWidth > a.x &&
        projectile.y < a.y + smallEnemyHeight &&
        projectileHeight + projectile.y > a.y);
}

// Draw everything
let render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (player_health>750){
        // Between 751 and MAX
        playerImage.src = "ressources/images/game_object/player_140px.png";
    } else if (player_health>500){
        // Between 501 and 750
        playerImage.src = "ressources/images/game_object/player_750hp_140px.png";
    } else if(player_health>250){
        // Between 251 and 500
        playerImage.src = "ressources/images/game_object/player_500hp_140px.png";
    } else if (player_health>1){
        // Between 1 and 250
        playerImage.src = "ressources/images/game_object/player_250hp_140px.png";
    } else{
        playerImage.src = "ressources/images/game_object/player_0hp_140px.png"
    }

    playerImage.onload = function () {
        playerReady = true;
    };
    if (playerReady) {
        ctx.drawImage(playerImage, player.x, player.y);
    }
    for (let i = 0; i < player_projectiles.length; i++) {
        if (projectileReady) {
            ctx.drawImage(projectileImage, player_projectiles[i].x, player_projectiles[i].y);
            player_projectiles[i].draw(i);
        }
    }
    if (healingPoint != null) {
        if (healingPointReady) {
            ctx.drawImage(healingPointImage, healingPoint.x, healingPoint.y);
            healingPoint.draw();
        }
    }

    for (let i = 0; i < enemies.length; i++) {
        if (smallEnemyReady) {
            ctx.drawImage(smallEnemyImage, enemies[i].x, enemies[i].y);
            enemies[i].draw(i);
        }
    }

    if (gameOver) {
        ctx.font = "60px Arial";
        ctx.fillStyle = rgb(100, 194, 168);
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
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

// The main game loop
let main = function () {
    let now = Date.now();
    //let delta = now - then;
    //update(delta / 1000);
    //console.log(delta);

    readyToShoot = lastShot + projectileDelayMs < now;

    if (!gameOver) {
        player.draw();
        // next level
        if (enemies.length === 0) {
            level++;
            console.log(level);
            // Spawn enemies
            let nbEnemy = 2 * level - 1;
            for (let i = 0; i < nbEnemy; i++) {
                let y = Math.random() * canvas.height;
                let x = Math.random() * canvas.width;
                let e = new SmallEnemy(x, y, x % 2 === 0, y % 2 === 0);
                // Ensure enemies don't spawn in the player
                if (enemyCollidePlayer(player, e)) {
                    i--;
                    continue;
                }
                enemies[i] = e;
            }
            if (level % 3 === 0) {
                //Spawn healing point
                healingPoint = new HealingPoint(Math.random() * canvas.height, Math.random() * canvas.width);
            }
        }
    }

    render();
    then = now;

    // player lost
    if (player_health <= 0) {
        player_health = 0;
        gameOver = true;
    }

    // dashboard update
    document.getElementById("currentScore").innerText = "Score: " + score;
    document.getElementById("currentLevel").innerText = "Level: " + level;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};


// keycodes
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
/*
for(let i = 0; i<5;i++){
    let x = Math.random()*canvas.width;
    let y = Math.random()*canvas.height;
    enemies[i] = new SmallEnemy(x, y, x%2===0, y%2===0)
}
*/
/* ### END DEBUG ### */


main();



