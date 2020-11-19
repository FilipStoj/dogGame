// Henter spillet fra index og displayer context
let canvas = document.querySelector("#canvas"); 
let ctx = canvas.getContext('2d'); 



// Billede variabler 

let dog = new Image(); 
dog.src= 'images/dog.png'; 

let road = new Image(); 
road.src= 'images/road.jpg'

let wall = new Image(); 
wall.src= 'images/vej.png'

let bone = new Image(); 
bone.src= 'images/bone.png'

let goal = new Image(); 
goal.src = 'images/goal.png'



// Maze pattern 

maze = 

[
    [0,1,1,1,1,1,1,1,1,1,1,1,1,3],
    [0,1,0,0,0,0,0,0,0,0,1,1,1,1],
    [0,1,0,1,1,1,0,0,1,0,0,0,0,0],
    [0,1,0,0,1,0,0,1,1,1,0,4,0,0],
    [0,1,1,1,1,1,1,1,0,0,0,1,1,1],
    [0,1,0,1,0,0,0,1,1,1,0,0,0,1],
    [0,1,0,1,1,1,0,1,0,0,0,0,0,1],
    [4,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,1,0,0,1,0,0,0,0,0],
    [0,1,1,1,1,1,0,0,1,0,0,0,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,0,0],
    [0,4,0,0,0,1,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,1,1,1,2],
]


// Størrelse på tiles & player position 

let tileSize = 50; 
let playerPosition = {x:9, y:9};


// De forskellige tiles 

let walls = 0; 
let roads = 1;
let dogpimp = 2;
let goals = 3;
let bones = 4; 


// Maze Drawing med if & else sætninger 

function drawMaze(){

    for(let y= 0; y < maze.length; y++){

      for(let x = 0; x < maze[y].length; x++){

        if(maze[y][x] === walls){
            ctx.drawImage(wall,x*tileSize,y*tileSize,tileSize,tileSize);
        }else if(maze[y][x] === roads){
            ctx.drawImage(road,x*tileSize,y*tileSize,tileSize,tileSize);
        }else if(maze[y][x] === dogpimp){
            playerPosition.x = x; 
            playerPosition.y = y; 
            ctx.drawImage(dog,x*tileSize,y*tileSize,tileSize,tileSize);
        }else if(maze[y][x] === goals){
            ctx.drawImage(goal,x*tileSize,y*tileSize,tileSize,tileSize);
        }else if(maze[y][x] === bones){
            ctx.drawImage(bone,x*tileSize,y*tileSize,tileSize,tileSize);
        }
      }
    }
}

container.style.display ="none";


// Gør at canvas/spillet ikke vises når man kommer ind på siden
canvas.style.display="none"; 

// Timer, altså hvor lang tid man har til at gennemføre spillet 
let seconds = 30;
document.querySelector('#time-showing').innerText = seconds;
let time;

let spilnavn = document.querySelector('#spilnavn');


// Starter spillet
startgame.addEventListener('click', playgame);
function playgame(){

    // Viser spillet når man trykker på knappen 
    canvas.style.display = "block";
    container.style.display = "block";

    // Fjerner knappen når spillet starter 
    startgame.style.display ="none";
    

    // Starter timeren med 
    time = setInterval(function () {
        seconds -= 1;
        document.querySelector('#time-showing').innerText = seconds;
        
        // Når tiden er udløbet så kommer gameover frem 
        if(seconds == 0){
            gameover();
        };
    
    }, 1000);
};



// Game over teksten som kommer efter man har tabt 
function gameover(){
    canvas.style.display = "none";
    spilnavn.innerHTML="Game Over";

    //gameover teksten vises ikke 
    let gameover = document.querySelector('#gameover');

    if(seconds == 0 ){
        gameover.innerHTML = "<span>Tiden er gået</span>";
    }; 

    clearInterval(time);    
};



function wintext(){
    canvas.style.display = "none";
    vindertext.innerHTML="Tillykke du vandt";
    
    let wintext = document.querySelector('#vindertext');

    container.style.display = "none"; 
}


function lostext(){
    canvas.style.display = "none"; 
    tabertext.innerHTML="Husk alle kødben"; 

    let lostext = document.querySelector('#tabertext'); 

    container.style.display = "none"; 
}

function pickup(){
    let gameSound = new Audio('gamesounds/pickup.wav');
    gameSound.play(); 
}

function sejr(){
    let gameSound = new Audio('gamesounds/sejr.wav')
    gameSound.play();
}

function walk(){
    let gameSound = new Audio('gamesounds/walk.wav');
    gameSound.play();
}

// Gør at man kan collect kødben samt gå ind i hundehuset 
function dogwalk(targetTile) {
    if (targetTile === bones || targetTile === roads || targetTile === goals) {
        return true;
    } else {
        return false;
    }
}

let score = 0; 

window.addEventListener('keydown', (e) => {
    let targetTile;
    switch (e.keyCode) {
        case 37: //left
            targetTile = maze[playerPosition.y][playerPosition.x - 1];
            if (dogwalk(targetTile)) {
                maze[playerPosition.y][playerPosition.x - 1] = dogpimp; //players nye position
                maze[playerPosition.y][playerPosition.x] = roads;
                drawMaze();
                walk();
                if (targetTile === bones) {
                    score++;
                    pickup();
                    document.getElementById("boxscore").innerHTML = "Bones: " + score;
                }
            }
            break;
        case 39: //Right
            targetTile = maze[playerPosition.y][playerPosition.x + 1];
            if (dogwalk(targetTile)) {
                maze[playerPosition.y][playerPosition.x + 1] = dogpimp; //players nye position
                maze[playerPosition.y][playerPosition.x] = roads;
                drawMaze();
                walk();
                if (targetTile === bones) {
                    score++;
                    pickup();
                    document.getElementById("boxscore").innerHTML = "Bones: " + score;
                }
                else if (targetTile === goals && score >=3){
                    wintext();
                    sejr(); 
                }
                else if (targetTile === goals && score <3){
                    lostext();
                }
            }
            break;
        case 38: //Up
            targetTile = maze[playerPosition.y - 1][playerPosition.x];
            if (dogwalk(targetTile)) {
                maze[playerPosition.y - 1][playerPosition.x] = dogpimp; //players nye position
                maze[playerPosition.y][playerPosition.x] = roads;
                drawMaze();
                walk();
                if (targetTile === bones) {
                    score++;
                    pickup();
                    document.getElementById("boxscore").innerHTML = "Bones: " + score;
                }
            }
            break;
        case 40: //down
            targetTile = maze[playerPosition.y + 1][playerPosition.x];
            if (dogwalk(targetTile)) {
                maze[playerPosition.y + 1][playerPosition.x] = dogpimp; //players nye position
                maze[playerPosition.y][playerPosition.x] = roads;
                drawMaze();
                walk();
                if (targetTile === bones) {
                    score++;
                    pickup();
                    document.getElementById("boxscore").innerHTML = "Bones: " + score;
                }
            }
            break;
    }
    console.log(score);
})

window.addEventListener("load", drawMaze);

