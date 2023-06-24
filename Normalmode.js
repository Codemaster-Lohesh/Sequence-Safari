//Navbar activation
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

//Selecting dialog
let gameOverScreen = document.querySelector('#gameoverPopup');

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})

//Random colors
let colors=[
  'red',
  'blue',
  'green',
  'yellow',
  'orange',
  'purple',
  'pink',
  'cyan',
  'magenta',
  'lime',
  'teal',
  'silver',
  'gold',
  'indigo',
  'brown'
];
let colorlist=[];
function randomColorList(){
  colorlist=[]
  for (let i=0;i<5;i++){
    colorlist.push(colors[Math.floor(Math.random()*15)]);
  }
}
randomColorList();

//Assigning colors to target blocks
const targetblocks=document.querySelector('#target-blocks');
function updateTargetblocks(){
  for (let i=0;i<5;i++){
    targetblocks.querySelectorAll('div')[i].style.backgroundColor = colorlist[i];
}
}
updateTargetblocks();
//Selecting the gameboard
let gameboard= document.querySelector('#game-board');

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
  for (let i=0 ; i<5 ; i++){
    foodPos.push({x : randomPosition().x , y: randomPosition().y , color: colorlist[i]});
  }
}
foodPositions()

function addFood(){
  let html=''
  for (let i=0 ; i<foodPos.length; i++){
    html+=`<div class="food" style= "grid-area: ${foodPos[i].x} / ${foodPos[i].y}; background-color: ${foodPos[i].color};" ></div>`;
  }
  gameboard.innerHTML = html;
}
addFood();

//Adding the snake to the gameboard
let snakeBody=[{x:10 , y:10},{x:11,y:10},{x:12 , y:10}];

function updateSnake(){
  const inputDirection = getInputDirection()
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] }
  }
  snakeBody[0].x += inputDirection.y;
  snakeBody[0].y += inputDirection.x;
  
  let html='';
  for (let i=0 ; i<snakeBody.length ; i++){
    html += `<div class="snake" style = "grid-area: ${snakeBody[i].x} / ${snakeBody[i].y};"></div>`
  }
  gameboard.innerHTML += html;
}

updateSnake();

function checkPosition(){
  for (let i=0 ; i<foodPos.length ; i++){
     if (foodPos[i].x===snakeBody[0].x && foodPos[i].y===snakeBody[0].y){
      return i+1;
     }
  }
}

//Starting the game
let lastRenderTime = 0
let gameOver = false
let SNAKE_SPEED=10;
let score=0;
let NormalHighscore=localStorage.getItem("NormalHighscore");
let scoreEle=document.querySelector('#score');
let highScoreEle=document.querySelector('#highscore');
let timer=document.querySelector('#timer');


//Timer
let time=30;
let lasttime=0;
function updateTimer(currentTime){
  const inputDirection = getInputDirection()
  if (inputDirection.x!=0 || inputDirection.y!=0){
    if ((currentTime/1000)-lasttime >=1){
      lasttime=Math.floor(currentTime/1000);
      time-=1;
      timer.innerText= `Time left: ${time} s`;
    }
  }
}
 


//Checking if the game is over
function handleGameover(){
  if (snakeBody[0].x<=0 || snakeBody[0].x>20 || snakeBody[0].y<=0 || snakeBody[0].y>20){
    gameOver=true;
  }
  /* for (let i=1; i<snakeBody.length;i++){
    if (snakeBody[0].x==snakeBody[i].x && snakeBody[0].y==snakeBody[i].y){
      gameOver=true;
    }
  } */
  if (time<=0){
    gameOver=true;
  }
}

//Reloading the page
function reload(){
  window.location.reload();
}

function main(currentTime) {
  handleGameover();
  if (gameOver) {
    gameOverScreen.showModal();
    return
  }


  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return


  lastRenderTime = currentTime

  updateTimer(currentTime);
  addFood();
  updateSnake();
  if (checkPosition()){
    let returnValue=checkPosition();
    if (returnValue==1){
      foodPos.splice(returnValue-1,1);
      score+=1;
    }
    scoreEle.innerText=`Score: ${score}`;
    if (NormalHighscore<score){
      NormalHighscore=score;
      localStorage.setItem("NormalHighscore",NormalHighscore);
    }
    highScoreEle.innerText=`High score: ${NormalHighscore}`;
  }
  if (foodPos.length==0){
    randomColorList();
    updateTargetblocks();
    foodPositions();
    time+=10;
  }
}

window.requestAnimationFrame(main)

