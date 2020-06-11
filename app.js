//Rounak
//Query Selector
//Objective:In this game if pokemon ball gets touched by red balls game is terminated,and if it is touched by white balls then points is added.Make sure you use keyboards arrow key to operate 

const message = document.querySelector(".message");
const scoreOutput = document.querySelector(".score");
const btn = document.querySelector(".btn");
const container = document.querySelector(".container");
const pokemon = document.querySelector(".pokemon");
let boundPokemon = pokemon.getBoundingClientRect();
const finalscore = document.querySelector(".final-score");
const gameover = document.querySelector(".gameover");
let boundContainer = container.getBoundingClientRect();
//Event Listener
btn.addEventListener("click", startGame);
document.addEventListener("keydown", pressKeyOn);
document.addEventListener("keyup", pressKeyOff);
//Player Object
let player = {
    score: 0,
    redballs: 1,
    whiteballs: 1,
    inPlay: false,
    speed: 5
};


//Mouse Keys 
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

function pressKeyOn(event) {
    event.preventDefault();
    //Making true only when 
    keys[event.key] = true;
}

function pressKeyOff(event) {
    event.preventDefault();
    keys[event.key] = false;
}



function startGame() {
    message.style.display = "none";
    finalscore.style.display = "none";
    gameover.style.display = "none"
    btn.style.display = "none";
    pokemon.style.display = "block";
    player.score = 0;
    player.redballs = 1;
    player.whiteballs = 2;
    player.inPlay = true;
    scoreupdate();
    setupballs(2);
    requestAnimationFrame(playGame);
    //Launch animaion
}

function playGame() {
    if (player.inPlay == true) {

        if (keys.ArrowDown && boundPokemon.y < (boundContainer.height - boundPokemon.height - 20)) {
            boundPokemon.y += player.speed;
        }
        if (keys.ArrowUp && boundPokemon.y > 0) {
            boundPokemon.y -= player.speed;
        }
        if (keys.ArrowLeft && boundPokemon.x > 0) boundPokemon.x -= player.speed;
        if (keys.ArrowRight && boundPokemon.x < (boundContainer.width - boundPokemon.width - 20)) {
            boundPokemon.x += player.speed;
        }
        pokemon.style.left = boundPokemon.x + "px";
        pokemon.style.top = boundPokemon.y + "px";
        console.log(pokemon);
        //console.log(pokemon);
        requestAnimationFrame(playGame);

        let tempEnemy = document.querySelectorAll(".redballs");
        let tempFriend = document.querySelectorAll(".whiteballs")
        for (let i = 0; i < tempFriend.length; i++) {
            bgMover(tempEnemy[i]);
            bgMover(tempFriend[i]);
        }
    }

}


function bgMover(e) {
    e.x += e.speed;

    //console.log(boundContainer.width);
    if (e.x > boundContainer.width - 100) {
        e.x = 100;
        e.y = Math.floor(Math.random() * boundContainer.height - 100);
        if ((e.y > boundContainer.height - 100) || (e.y < 0)) e.y = 100;
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

function makeWhiteBalls() {
    //Correct left balls coming
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
    //Correct left balls coming
    if (player.redballs > 0) {
        let temp = player.redballs;
        let div = document.createElement("div");
        div.classList.add("redballs");
        div.x = Math.floor(Math.random() * 710);
        if (div.x < 0) div.x = 100;
        div.y = 0.5625;
        div.speed = Math.ceil(Math.random() * 1) + 3;
        container.appendChild(div);
        div.style.left = div.y + "px";
        div.style.top = div.x + "px";
    }
}

function endGame() {
    const whiteballs = document.querySelectorAll(".whiteballs");
    const redballs = document.querySelectorAll(".redballs");
    finalscore.textContent = `SCORE \n  ${player.score}`;

    finalscore.style.display = "block";
    gameover.style.display = "block"
    btn.style.display = "block";
    pokemon.style.display = "none";

    whiteballs.forEach(node => {
        node.style.display = "none"
    })
    redballs.forEach(node => {
        node.style.display = "none"
    })

    //Local Storage
    if ((localStorage.getItem('score') < player.score) || (localStorage.getItem("score") === null)) {
        finalscore.textContent = `NEW HIGH SCORE  ${player.score}`;
        finalscore.style.color = "yellow";
        localStorage.setItem('score', player.score);
    }

    player.inPlay = false;

}

function isCollide(a, b) {
    //a=Pokemon b=white or red balls
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    let pythag = getDistance(aRect.x, aRect.y, bRect.x, bRect.y);
    //console.log(`pythag:${pythag} calc${(aRect.height / 2 + bRect.width / 2)}`);
    if (pythag < (aRect.height / 2 + bRect.height / 2)) {
        if (b.classList.value === "whiteballs") {
            console.log(b);
            bRect.bottom = 0 + "px";
            bRect.height = 0 + "px";
            bRect.left = 0 + "px";
            bRect.right = 0 + "px";
            bRect.top = 0 + "px";
            bRect.width = 0 + "px";
            bRect.x = 0 + "px";
            bRect.y = 0 + "px";
            b.top = 0 + "px";
            b.style = "none";
            player.score += 1;
            scoreupdate();
        } else
            endGame();
    }

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