//Navbar activation
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})

//Selecting the gameboard
let gameboard= document.querySelector('#game-board');

//Selecting dialog
let gameOverScreen = document.querySelector('#gameoverPopup');


//Random words
let words=[
  'APPLE',
  'BREAD',
  'CARRY',
  'DANCE',
  'EARLY',
  'FANCY',
  'GRAPE',
  'HURRY',
  'JOLLY',
  'KITTY',
  'LEMON',
  'MAGIC',
  'NOBLE',
  'OASIS',
  'PIANO'
];
let letters=[];
function randomWordList(){
  letters=[]
  let word=words[Math.floor(Math.random()*words.length)];
  for (let i=0;i<word.length;i++){
    letters.push(word[i]);
  }
}
randomWordList();

//Assigning letters to target blocks
const targetblocks=document.querySelector('#target-blocks');
function updateTargetblocks(){
  for (let i=0;i<letters.length;i++){
    targetblocks.querySelectorAll('div')[i].innerText = letters[i];
}
}
updateTargetblocks();


//Generating random position
let randomPosition = () => {
  return { x: Math.floor(Math.random() * 20) + 1, y: Math.floor(Math.random() * 20) + 1 };
}

//Input handling
let inputDirection = { x: 0, y: 0 }
let lastInputDirection = { x: 0, y: 0 }

window.addEventListener('keydown', e => {updateDirection(e)});
function updateDirection(e){
  switch (e.key) {
    case 'w':
      if (lastInputDirection.y !== 0) break
      inputDirection = { x: 0, y: -1 }
      break
    case 's':
      if (lastInputDirection.y !== 0) break
      inputDirection = { x: 0, y: 1 }
      break
    case 'a':
      if (lastInputDirection.x !== 0) break
      inputDirection = { x: -1, y: 0 }
      break
    case 'd':
      if (lastInputDirection.x !== 0) break
      inputDirection = { x: 1, y: 0 }
      break
  }
}
function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}
const controls=document.querySelectorAll('#direction-control div');
controls.forEach(key =>{
  key.addEventListener("click", ()=>updateDirection({key: key.dataset.key}))
})

//Adding the food to the gameboard
let foodPos=[]
function foodPositions(){
  foodPos=[];
  for (let i=0 ; i<letters.length ; i++){
    foodPos.push({x : randomPosition().x , y: randomPosition().y , text: letters[i]});
  }
}
foodPositions()

function addFood(){
  let html=''
  for (let i=0 ; i<foodPos.length; i++){
    html+=`<div class="food" style= "grid-area: ${foodPos[i].x} / ${foodPos[i].y};" >${foodPos[i].text}</div>`;
  }
  gameboard.innerHTML+= html;
}
addFood();


//Adding Powerups to the game-board
let powerupPos;
function powerupPosition(){
  powerupPos=randomPosition();
}
powerupPosition();

function addPowerup(){
  let html='';
  html+=`<div class="powerup" style= "grid-area: ${powerupPos.x} / ${powerupPos.y};" ></div>`;
  gameboard.innerHTML+=html;
} 

//Adding Portal to the gameboard
let portal=[];
function portalPosition(){
  for (let i=0;i<2;i++){
    portal.push(randomPosition());
  }
}
portalPosition();
function addPortals(){
  for (let i=0;i<2;i++){
    gameboard.innerHTML+=`<div class="portal" style= "grid-area: ${portal[i].x} / ${portal[i].y};" ></div>`;
  }
}

//Adding obstacles to the gameboard
let obstacle=[];
function obstaclePosition(){
  let randomObsPos=randomPosition();
  for (let i=0;i<3;i++){
    obstacle.push({x: randomObsPos.x+i , y: randomObsPos.y});
  }
}
obstaclePosition();

function updateObstacles(){
  if (obstacle[0].x>=20){
    obstacle[0].x=1;
  }
  if (inputDirection.x!=0 || inputDirection.y!=0){
    for (let i = obstacle.length - 2; i >= 0; i--) {
      obstacle[i + 1] = { ...obstacle[i] }
    }
    obstacle[0].x += 1;
    obstacle[0].y += 0;
  }
  for (let i=0 ; i<obstacle.length ; i++){
    gameboard.innerHTML += `<div class="obstacle" style = "grid-area: ${obstacle[i].x} / ${obstacle[i].y};"></div>`
  }
}

//Adding the snake to the gameboard
let snakeBody=[{x:10 , y:10},{x:11,y:10},{x:12 , y:10}];
let newSegments=2;

function updateSnake(){
    const inputDirection = getInputDirection()
    if (inputDirection.x!=0 || inputDirection.y!=0){
      for (let i = snakeBody.length - 2; i >= 0; i--) {
          snakeBody[i + 1] = { ...snakeBody[i] }
      }
      snakeBody[0].x += inputDirection.y;
      snakeBody[0].y += inputDirection.x;
    }
    let html='';
    for (let i=0 ; i<snakeBody.length ; i++){
        html += `<div class="snake" style = "grid-area: ${snakeBody[i].x} / ${snakeBody[i].y};"></div>`
    }
    gameboard.innerHTML += html;
}
function addSegments(){
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
      }
}
updateSnake();

//Checking if Snakehead is on food
function checkFood(){
  for (let i=0 ; i<foodPos.length ; i++){
     if (foodPos[i].x===snakeBody[0].x && foodPos[i].y===snakeBody[0].y){
      return i+1;
     }
  }
}

//Checking if the Snakehead is on Powerup
function checkPowerup(){
  if (powerupPos.x===snakeBody[0].x && powerupPos.y===snakeBody[0].y){
    return true;
  }
  else{return false;}
}

//Checking if the Snakehead is on Portal
function checkPortal(){
  if (portal[0].x===snakeBody[0].x && portal[0].y===snakeBody[0].y){
    snakeBody[0].x=portal[1].x;
    snakeBody[0].y=portal[1].y;
  }
  else if(portal[1].x===snakeBody[0].x && portal[1].y===snakeBody[0].y){
    snakeBody[0].x=portal[0].x;
    snakeBody[0].y=portal[0].y;
  }
}

//Checking if the snake is on the obstacle
function checkObstacle(){
  for (let i=0;i<snakeBody.length;i++){
    for (let j=0;j<obstacle.length;j++){
      if (snakeBody[i].x==obstacle[j].x && snakeBody[i].y==obstacle[j].y){
        return true;
      }
      else{return false;}
    }
  }
}

//Starting the game
let lastRenderTime = 0;
let gameOver = false;
let SNAKE_SPEED=10;
let score=0;
let HackerplusScore=localStorage.getItem("HackerplusScore");
const scoreEle=document.querySelector('#score');
const highScoreEle=document.querySelector('#highscore');
const timer=document.querySelector('#timer');
const livesEle=document.querySelector('#lives');
const pauseButton=document.querySelector('#pauseButton');

//Save game feature
let saveNumber=0;
const saveFiles=document.querySelector('#savefiles');
const saveGameEle=document.querySelector('#saveGame');
let loadgameEle;
function saveGame(){
  saveNumber++;
  sessionStorage.setItem(`savefile${saveNumber}`,JSON.stringify({food: foodPos,snake: snakeBody,speed:SNAKE_SPEED
    ,obs:obstacle,powerup:powerupPos,time:time,lifeleft:lives ,score: score,word:letters, direction: inputDirection }));
  saveFiles.innerHTML+=`<div id="savefile">Save File No.<span>${saveNumber}</span> 
  <div id="loadgame">Load Game</div>
  
  </div>`
  loadgameEle=document.querySelectorAll('#loadgame');
  for (let i=0;i<saveNumber;i++){
    loadgameEle[i].addEventListener('click',loadgame);
  }
}

saveGameEle.addEventListener('click',saveGame);

function loadgame(event){
  const clickedEle=event.target;
  const fileNo=clickedEle.closest('#savefile').querySelector('span').innerText;
  let file=JSON.parse(sessionStorage.getItem(`savefile${fileNo}`));
  foodPos=file.food;
  snakeBody=file.snake;
  SNAKE_SPEED=file.speed;
  obstacle=file.obs;
  powerupPos=file.powerup;
  letters=file.word;
  updateTargetblocks();
  time=file.time;
  lives=file.lifeleft;
  livesEle.innerText=`Lives : ${lives}`
  inputDirection=file.direction;
  score=file.score;
}

//Pause button
let pause=false;
pauseButton.addEventListener('click',togglePause);

function togglePause(){
  pause=!pause;
}

//Lives system
let lives=3;
livesEle.innerText=`Lives : ${lives}`;

let lifelost=false;

//Timer
let time=30;
let lasttime1=0;
function updateTimer(currentTime){
  const inputDirection = getInputDirection()
  if (inputDirection.x!=0 || inputDirection.y!=0){
    if ((currentTime/1000)-lasttime1 >=1){
      lasttime1=Math.floor(currentTime/1000);
      time-=1;
      timer.innerText= `Time left: ${time} s`;
    }
  }
} 


//Checking if the game is over
function handleGameover(){
  if (snakeBody[0].x<=0 || snakeBody[0].x>20 || snakeBody[0].y<=0 || snakeBody[0].y>20){
    if (lives==1){
        gameOver=true;
    }
    else{
        lifelost=true;
    }
  }
  for (let i=0; i<snakeBody.length;i++){
    if (i!=0 && snakeBody[0].x==snakeBody[i].x && snakeBody[0].y==snakeBody[i].y){
      if (lives==1){
        gameOver=true;
      }
      else{
        lifelost=true;
      }
    }
  }
  if (time<=0){
    if (lives==1){
        gameOver=true;
    }
    else{
        lifelost=true;
    }
  }
  if (checkObstacle()){
    if (lives==1){
      gameOver=true;
    }
    else{
      lifelost=true;
    }
  }
}
//Increasing snake speed
let lasttime2=0;
function updateSnakespeed(time){
  const inputDirection = getInputDirection()
  if (inputDirection.x!=0 || inputDirection.y!=0){
    if ((time/1000)-lasttime2 >=1){
      lasttime2=Math.floor(time/1000)
      SNAKE_SPEED+=0.1;
      /* console.log([time,lasttime2,SNAKE_SPEED]); */ //Just Making sure the speed is updated properly
    }
  }
}

//Audio
const sound=new Audio('score.mp3');
const lost=new Audio('lose.mp3');

//Reloading the page
function reload(){
  window.location.reload();
}

function main(currentTime) {
  handleGameover();
  if (gameOver) {
    lost.play();
    localStorage.removeItem("lives");
    gameOverScreen.showModal();
    return
  }
  if (lifelost){
    lost.play();
    lives-=1;
    livesEle.innerText=`Lives : ${lives}`;
    snakeBody=[{x:10 , y:10},{x:11,y:10},{x:12 , y:10}];
    inputDirection = { x: 0, y: 0 };
    lifelost=false;
  }


  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return
  
  
  lastRenderTime = currentTime


  if (!pause){
    gameboard.innerHTML='';
    updateTimer(currentTime);
    updateSnakespeed(currentTime);
    addFood();
    addPowerup();
    updateSnake();
    addPortals();
    updateObstacles();
  }
  
  //Eliminating eaten food and updating score
  if (checkFood()){
    let returnValue=checkFood();
    if (returnValue==1){
      sound.play();
      foodPos.splice(returnValue-1,1);
      score+=1;
    }
    scoreEle.innerText=`Score: ${score}`;
    if (HackerplusScore<score){
      HackerplusScore=score;
      localStorage.setItem("HackerplusScore",HackerplusScore);
    }
    highScoreEle.innerText=`High score: ${HackerplusScore}`;
  }
  
  //Regenerating food
  if (foodPos.length==0){
    randomWordList();
    updateTargetblocks();
    foodPositions();
    time+=20;
    addSegments();
    powerupPosition();
  }

  //Powerup
  if (checkPowerup()){
    sound.play();
    powerupPos={};
    snakeBody.pop();
    SNAKE_SPEED-=0.5
  }

  //Portal
  checkPortal();
}

window.requestAnimationFrame(main)

