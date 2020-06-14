//Rounak
//Query Selector
//Objective:In this game if pokemon ball gets touched by red balls game is terminated,and if it is touched by white balls then bonus points is added.Make sure you use keyboards arrow key to operate 
const message = document.querySelector(".message");
const scoreOutput = document.querySelector(".score");
const btn = document.querySelector(".btn");
const container = document.querySelector(".container");
const pokemon = document.querySelector(".pokemon");
let boundPokemon = pokemon.getBoundingClientRect();
const finalscore = document.querySelector(".final-score");
const gameover = document.querySelector(".gameover");
const logo = document.querySelector(".logo");
const retry = document.querySelector(".retry");
let boundContainer = container.getBoundingClientRect();
let infoicon = document.querySelector(".info-icon");
let cross = document.querySelector(".cross");
//Event Listener
btn.addEventListener("click", startGame);
cross.addEventListener("click", crossdisable);
retry.addEventListener("click", startGame);
infoicon.addEventListener("click", info);
document.addEventListener("keydown", pressKeyOn);
document.addEventListener("keyup", pressKeyOff);

//Player Object
let player = {
    score: 0,
    redballs: 1,
    whiteballs: 10000,
    inPlay: false,
    speed: 5
};


//KEYBOARD Keys 
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

function pressKeyOn(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function pressKeyOff(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function info() {
    document.querySelector(".game-instructions").style.display = "block";
}

function crossdisable() {
    document.querySelector(".game-instructions").style.display = "none";
}

function startGame() {
    document.querySelector(".topbar").style.opacity = "1";
    document.querySelector(".pokemoncopy").style.display = "none";
    infoicon.style.display = "none";
    message.style.display = "none";
    finalscore.style.display = "none";
    gameover.style.display = "none"
    btn.style.display = "none";
    pokemon.style.display = "block";
    logo.style.display = "none"
    player.score = 0;
    player.redballs = 1;
    player.whiteballs = 1000;
    player.inPlay = true;
    retry.style.display = "none";
    scoreupdate();
    setupballs(4);
    requestAnimationFrame(playGame);

    //Launch animaion
}

container.addEventListener("mousemove", e => {
    pokemon.style.left = e.clientX + "px";
    pokemon.style.top = e.clientY + "px";
})

function playGame() {
    if (player.inPlay == true) {
        //Boundary condition of pokemon ball
        if (keys.ArrowDown && boundPokemon.y < (boundContainer.height - boundPokemon.height)) boundPokemon.y += player.speed;
        if (keys.ArrowUp && boundPokemon.y > 0) boundPokemon.y -= player.speed;
        if (keys.ArrowLeft && boundPokemon.x > 0) boundPokemon.x -= player.speed;
        if (keys.ArrowRight && boundPokemon.x < (boundContainer.width - boundPokemon.width - 20)) boundPokemon.x += player.speed;
        // pokemon.style.left = boundPokemon.x + "px";
        // pokemon.style.top = boundPokemon.y + "px";


        //if (pokemon.top < (boundContainer.height - pokemon.height)) pokemon.top += player.speed;
        //if (boundPokemon.y > 0) boundPokemon.y -= player.speed;
        //if (pokemon.left > 0) pokemon.left -= player.speed;
        //if (keys.ArrowRight && boundPokemon.x < (boundContainer.width - boundPokemon.width - 20)) boundPokemon.x += player.speed;
        requestAnimationFrame(playGame);

        let tempEnemy = document.querySelectorAll(".redballs");
        let tempFriend = document.querySelectorAll(".whiteballs")
        for (let ball = 0; ball < tempFriend.length; ball++) {
            bgMover(tempEnemy[ball]);
            bgMover(tempFriend[ball]);
        }
    }
}

//Moving red and white balls from left to right
function bgMover(e) {
    e.x += e.speed;
    if (e.x > boundContainer.width - 100) {
        e.x = 100;
        e.y = Math.floor(Math.random() * boundContainer.height - 75);
        if (e.y == 0) e.y = 0;
        if ((e.y > boundContainer.height - 75) || (e.y < 0)) e.y = 100;
        e.style.top = e.y + "px";
    }
    e.style.left = e.x + "px";
    isCollide(pokemon, e);

}

function setupballs(num) {
    for (let x = 0; x < num; x++) {
        makeWhiteBalls();
        makeRedBalls();
    }
}
//Forming red and white balls
function makeWhiteBalls() {
    if (player.whiteballs > 0) {
        let temp = player.whiteballs;
        let div = document.createElement("div");
        div.classList.add("whiteballs");
        div.x = Math.floor(Math.random() * 710);
        if (div.x < 0) div.x = 100;
        div.y = 0.5625;
        div.speed = Math.ceil(Math.random() * 1) + 3;
        container.appendChild(div);
        div.style.left = div.y + "px";
        div.style.top = div.x + "px";
    }
}

function makeRedBalls() {

    if (player.redballs > 0) {
        let temp = player.redballs;
        let div = document.createElement("div");
        div.classList.add("redballs");
        div.x = Math.floor(Math.random() * boundContainer.width - 100);
        if (div.x < 0) div.x = 100;
        div.y = 0;
        div.speed = Math.ceil(Math.random() * 1) + 3;
        container.appendChild(div);
        div.style.left = div.y + "px";
        div.style.top = div.x + "px";
    }
}

function endGame() {
    const whiteballs = document.querySelectorAll(".whiteballs");
    const redballs = document.querySelectorAll(".redballs");
    finalscore.textContent = `SCORE ${player.score}`;
    retry.style.display = "block"
    finalscore.style.display = "block";
    gameover.style.display = "block"
    document.querySelector(".topbar").style.opacity = "0";
    pokemon.style.display = "none";
    //Disappearing all the white and red balls from the screen
    whiteballs.forEach(node => {
        node.style.display = "none"
    })
    redballs.forEach(node => {
        node.style.display = "none"
    })

    //Local Storage
    //Storing data to local storage for getting high score
    if ((localStorage.getItem('score') < player.score) || (localStorage.getItem("score") === null)) {
        finalscore.textContent = `NEW HIGH SCORE  ${player.score}`;
        finalscore.style.color = "yellow";
        localStorage.setItem('score', player.score);
    }
    player.inPlay = false;
}
//This function occours when collision takes place between pokemon ball and different colour ball
function isCollide(a, b) {
    //a=Pokemon b=white or red balls

    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    let pythag = getDistance(aRect.x, aRect.y, bRect.x, bRect.y);

    if (pythag < (aRect.height / 2 + bRect.height / 2)) {
        if (b.classList.value === "whiteballs") {
            b.style.opacity = "0";
            vanish(b);
            player.score += 1;
            scoreupdate();
        } else
            endGame();
    }
}
//Toggling white balls property every 10sec
function vanish(b) {
    setInterval(() => {
        b.style.opacity = "10";
    }, 10000);
}
//Pythagorus Theorem
function getDistance(x1, y1, x2, y2) {
    let xdistance = x2 - x1;
    let ydistance = y2 - y1;
    let calc = Math.pow(xdistance, 2) + Math.pow(ydistance, 2)
    return Math.sqrt(calc);
}

function scoreupdate() {
    scoreOutput.textContent = player.score;
}