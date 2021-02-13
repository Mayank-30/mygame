var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var police,policeImg;

var bg,bgImg;


function preload(){
  trex_running =   loadAnimation("p.png","p1.png","pc2.png");
  trex_collided = loadAnimation("collided.png");
  
  groundImage = loadImage("g.png");
  
 
  
  obstacle1 = loadImage("ob.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3"); 

  policeImg= loadImage("police.png");
  bgImg=loadImage("bg.png");
}

function setup() {
  createCanvas(600, 400);

  bg=createSprite(200,200,10000,10000);
  bg.addImage("bg",bgImg);
  
  trex = createSprite(50,280,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.2;
  trex.setCollider("rectangle",0,0,trex.width,trex.height);

  police=createSprite(90,290,20,50);
  police.addImage("police",policeImg);
  police.scale=0.4;
  
  
  ground = createSprite(300,200,10000,20);
  ground.addImage("ground",groundImage);
  
  
  ground.depth = trex.depth;
  trex.depth = trex.depth + 1;
  
  gameOver = createSprite(300,70);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,180);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  police.visible = false;
  invisibleGround = createSprite(200,310,400,10);
  invisibleGround.visible = false;
  

  obstaclesGroup = new Group();
  
  score = 0;
 
 

}

function draw() {
  background(233);
  text("Score: "+ score, 500,50);
  textSize(18);
  textFont("Georgia");
  textStyle(BOLD);
  text("You are a theif press space to jump and save you.",50,20)

  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
  
    if(keyDown("space") && trex.y >= 159) {
      jumpSound.play();
      trex.velocityY = -14;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
  
  
    trex.collide(invisibleGround);
  
    spawnObstacles();
    
    if (score>0 && score%100 === 0){
      checkPointSound.play();
    }
  
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();  
      gameState = END;
        
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    police.visible=true;
    //set velcity of each game object to 0
    
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
   
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,305,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height);

    //generate random obstacles
    var rand = Math.round(random(1,6));
    obstacle.addImage("obsta",obstacle1);
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  police.visible = false;

  obstaclesGroup.destroyEach();
  
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
