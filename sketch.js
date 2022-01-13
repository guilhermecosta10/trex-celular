var trex, trex_running, edges, trex_collided;
var groundImage;
var solo, soloinvisivel;
var nuvem, nuvemImg, groupNuvens;
var cacto1, cacto2, cacto3, cacto4, cacto5, cacto6, groupCactos;
var contador = 0;
var gameOver;
var gameOverImg;
var restart;
var restartImg;
var JOGANDO = 1;
var FIM = 0;
var estadoJogo = JOGANDO;
var jump;
var die;


function preload()
{
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  nuvemImg = loadImage("cloud.png");
  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");

}

function setup()
{
  createCanvas(windowWidth,windowHeight);
  
  //criando o trex
  groupCactos = new Group();
  groupNuvens = new Group();
  trex = createSprite(50,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider("rectangle",0,0,150,trex.height);
  trex.debug = false;
  edges = createEdgeSprites();
  solo = createSprite(width/2,height-20,width,1);
  solo.addImage ("solo", groundImage);
  solo.x = solo.width/2;
  soloinvisivel = createSprite(width/2,height-10,width,1);
  soloinvisivel.visible = false;
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage("fim de jogo", gameOverImg);
  gameOver.scale = 0.8;
  restart = createSprite(width/2,height*2/3);
  restart.addImage(restartImg);
  restart.scale = 0.4;

  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50
}


function draw()
{
  //definir a cor do plano de fundo 
  background("white");
    text("Pontuação: "+contador,width-150,height-180);

    console.log (estadoJogo);
    console.log (trex.y);

    if(estadoJogo == JOGANDO)
    {
      restart.visible = false;
      gameOver.visible = false;
      contador = contador + Math.round(frameCount/60);

      if((touches.length > 0 || keyDown("space")) && trex.y >= height-35)
      {
        trex.velocityY = -10;
        jump.play();
        touches = [];
      }

      if(solo.x <0) 
      {
        solo.x = solo.width/2;
      }
     
      trex.velocityY = trex.velocityY + 0.5;
      solo.velocityX = -3 -contador/500;

     geradorNuvens();

     geradorObstaculos();

     if(groupCactos.isTouching(trex)) 
     {
      estadoJogo = FIM;
      die.play();
     }

    }

    else if(estadoJogo == FIM)
    {
      solo.velocityX = 0;
      groupCactos.setVelocityXEach(0);
      groupNuvens.setVelocityXEach(0);
      trex.changeAnimation ("collided", trex_collided);
      groupCactos.setLifetimeEach(-1);
      groupNuvens.setLifetimeEach(-1);
      trex.velocityY = 0;
      restart.visible = true;
      gameOver.visible = true;

    }

    if(touches.length > 0 || mousePressedOver(restart))
    {
      console.log("reiniciar");
      reiniciar();
      touches = [];
    }


  //impedir que o trex caia
  trex.collide(soloinvisivel);

  drawSprites();
}

function geradorNuvens ()
{
  if(frameCount % 80 == 0)
    { 
      nuvem = createSprite(width/2,height-150,15,15);
      nuvem.velocityX = -4 -contador/500;
      nuvem.addImage(nuvemImg);
      nuvem.y = Math.round(random(height-170,height-130));
      console.log(trex.depth);
      console.log(nuvem.depth);
      nuvem.depth = trex.depth;
      trex.depth = trex.depth +1;
      nuvem.lifetime = 75;
      groupNuvens.add(nuvem);
    }

}

function geradorObstaculos ()
{
  if(frameCount % 100 == 0)
    {
      var obstaculos = createSprite(width/2,height-30,10,10);
      obstaculos.velocityX = -6 -contador/500;
      var tipoDeCacto = Math.round(random(1,6));
      switch (tipoDeCacto) 
      {
        case 1 : obstaculos.addImage (cacto1);
        break;

        case 2 : obstaculos.addImage (cacto2);
        break;

        case 3 : obstaculos.addImage (cacto3);
        break;

        case 4 : obstaculos.addImage (cacto4);
        break;

        case 5 : obstaculos.addImage (cacto5);
        break;

        case 6 : obstaculos.addImage (cacto6);
        break;

        default : break;
      }

      obstaculos.scale = 0.5;
      obstaculos.lifetime = 200;
      groupCactos.add(obstaculos);
    }

}

function reiniciar() 
{
  estadoJogo = JOGANDO;
  gameOver.visible = false;
  restart.visible = false;
  contador = 0;
  groupCactos.destroyEach();
  groupNuvens.destroyEach();
  trex.changeAnimation("running", trex_running);
}