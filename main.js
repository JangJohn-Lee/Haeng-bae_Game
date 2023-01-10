//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver=false; // true 이면 게임 끝남, false 이면 게임안끝남

//우주선 좌표
let spaceshipX = canvas.width/2-26
let spaceshipY = canvas.height-60

let score = 0;

function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src="images/phillar.png";
  
  spaceshipImage = new Image();
  spaceshipImage.src="images/커서이미지.png";
  
  bulletImage = new Image();
  bulletImage.src="images/icons8-launch-24.png";
  
  enemyImage = new Image();
  enemyImage.src="images/느그스장이랑임마.png";
  
  gameOverImage = new Image();
  gameOverImage.src="images/game-over-glitch-background-retro-600w-1043560423.png";
}


function render(){
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`score: ${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arail";

  for(let i=0; i<bulletList.length; i++){
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
    }
  }

  for(let i=0; i<enemyList.length; i++){
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y)
  }
}

let keysDown={}
function setupKeyboardListner(){
  document.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];
    
    if(event.keyCode == 32 ){   // spacebar == 32
      createBullet()// 총알 생성
    }
  });
}

let bulletList = [] // 총알을 저장하는 리스트

function Bullet(){
  this.x=0;
  this.y=0;
  this.init=function(){
    this.x = spaceshipX+16;
    this.y = spaceshipY;
    this.alive=true // true 살아있는 총알 false 죽은 총알
    bulletList.push(this);
  };
  this.update = function(){
    this.y -= 7;
  };
  this.checkHit=function(){
   for(let i=0; i<enemyList.length; i++){ 
    if(this.y <=enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40){
      // 총알이 사라짐. 적군의 우주선 없어짐, 점수획득
      score++;
      this.alive = false // 사라지는 총알
      enemyList.splice(i,1);
    }
  }
}
}

function createBullet(){
  let b = new Bullet(); // 총알 하나 생성
  b.init();
}

function generateRandomValue(min,max){
  let randomNum = Math.floor(Math.random()*(max-min+1))+min;
  return randomNum;
}

let enemyList=[]

function Enemy(){
  this.x=0;
  this.y=0;
  this.init=function(){
    this.y=0;
    this.x=generateRandomValue(0, canvas.width-60);
    enemyList.push(this);
  };
  this.update=function(){
    this.y += 2;

    if(this.y >= canvas.height -66){
      gameOver = true;
    };
  }
}

function createEnemy(){
  const interval = setInterval(function(){
    let e = new Enemy();
    e.init();
  },800);
}

function update(){
  if( 39 in keysDown){ // === ArrowRight
    spaceshipX += 4; // 우주선의 속도
  }
  if( 37 in keysDown){ // ===ArrowRight
    spaceshipX -= 4;
  }
  if( 38 in keysDown){
    spaceshipY -= 4;
  }
  if( 40 in keysDown){
    spaceshipY += 4;
  }
  if(spaceshipY <=0){
    spaceshipY =0;
  }
  if(spaceshipY >= canvas.height-59){
    spaceshipY = canvas.height-59;
  }

  if(spaceshipX <= 0){
    spaceshipX = 0;
  }
  if(spaceshipX >= canvas.width-52){
    spaceshipX = canvas.width-52;
  }
    //우주선 좌표값이 무한대로 업데이트가 되지 않게!
  //총알의 y 좌표 업데이트 하는 함수 호출
  for(let i=0; i<bulletList.length; i++){
    if(bulletList[i].alive){
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }
  for(let i=0; i<enemyList.length; i++){
    enemyList[i].update();
  }
}

function main(){
  if(!gameOver){
    update(); // 좌표값을 업데이트하고
    render(); // 그려주고!
    requestAnimationFrame(main);
  }else{
    ctx.drawImage(gameOverImage, 10, 100, 380, 380);
  }

}

loadImage();
main();
setupKeyboardListner();
createEnemy();

// 방향키를 누르면
// 우주선의 xy 좌표가 바뀌고
// 다시 render 그려준다

// 총알만들기
//1. 스페이스바를 누르면 총알발사
//2. 총알이 발사 = 총알의 y값이 --, 총알의 x값은 ? 스페이스를 누른 순간의 우주선의 좌표
//3. 발사된 총알들은 총알 배열에 저장을 한다.
//4. 총알들은 x,y 좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render 그려준다.

// 적군 만들기
// x, y, 위치 초기화, 업데이트 함수
// 적군 위치가 랜덤
// 적군 밑으로 내려옴  == y값 증가
// 1초마다 하나씩 젠
// 적군이 우주선 or 바닥 에 닿으면 게임 끝
// 적군과 총알이 만나면 우주선이 사라짐. 점수 1 ++;

//적군이 죽는다 == 총알이 적에게 닿는다.
// 총알.y <= 적군.y && 총알.x >= 적군.x && 총알.x <= 적군.x +60
// == 닿았다
// 총알 사라짐. 적군 사라짐. 점수 오름