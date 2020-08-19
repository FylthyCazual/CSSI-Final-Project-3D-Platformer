/* global createCanvas,
background,
WEBGL,
rect,
rectMode,
CENTER,
rotateX,
stroke,
fill,
translate,
box,
noStroke,
sphere,
HSB,
colorMode,
HALF_PI, PI, TWO_PI,
rotateZ,rotateY,
keyIsDown,
push, pop, cylinder, plane,
collideRectRect,
random, texture,
loadImage,
frameCount
*/

let brightness;
let playerX, playerY, playerZ; //Coordinates of Player Character
let xMomentum, yMomentum; //Values that allow for slippery surfaces
let spawnX, spawnY, spawnZ;
let orientation; //Determines camera angles to see what direction player inputs will go
let speed; //Player Character movement speed
let platforms = [];
let testPlatform;
let airMomentum; //Value for calculating player's movement along 'Z'-axis
let isGrounded; //Stores value of grounded() on each frame
let gridSpace;
let camX, camY;
let camXP, camYP; //Stores camera position coordinates
let camYPFactor;
let playerSpeed;
let flag, arrowImg, spacebarImg;

function setup() {
  gridSpace = 50;
  
  createCanvas(800, 500, WEBGL);
  //noStroke();
  colorMode(HSB, 360, 100, 100);
  brightness = 100;
  playerX = 0;
  playerY = 0;
  playerZ = -gridSpace/2;
  xMomentum = 0;
  yMomentum = 0;
  spawnX = playerX;
  spawnY = playerY;
  spawnZ = playerZ;
  speed = 5;
  airMomentum = 0;
  isGrounded = false;
  camX = -HALF_PI-PI/5;
  camY = 0;
  camXP = 0;
  camYP = 0;
  camYPFactor = 0.5;
  flag = loadImage('https://cdn.glitch.com/5e819009-a628-48ac-b6a1-97967256aac3%2FVery-Basic-Flag-Filled-icon.png?v=1595982583835');
  arrowImg = loadImage('https://cdn.glitch.com/59fa8f04-8026-4ea4-ae4c-898b86e70d1c%2Ficons8-right-arrow-100.png?v=1595892879455');
  spacebarImg = loadImage('https://cdn.glitch.com/5e819009-a628-48ac-b6a1-97967256aac3%2Fcomputer_key_Space_bar.png?v=1595974914125');
  playerSpeed = gridSpace/10;
  //Code for testing
  
  testPlatform = new Platform(0,0,0,9,9,50,80,80);
  platforms.push(testPlatform);
  //img3D(x, y, z, w, h, img, xt = 0, yt = 0, zt = 0)
  // for (let i = 0; i < 20; i++) {
  //   if (!(i > 10 && i < 13)) {
  //     let platform = new Platform(5+i,0,0,1,1,random(360),100,100);
  //     platforms.push(platform);
  //   }
  // }
  makePath(5,0,0,1,0,0,10);
  makePath(17,0,0,1,0,0,8);
  makePath(25,0,0,0,1,0,10);
  makePath(25,10,0,0,2,1,10);
  makePath(25,30,10,-1,0,0,10);
  
  let movingPlatform = new MovingPlatform(-1,0,0,900,15,30,-10,1,1,random(360),100,100,0,0,0);
  platforms.push(movingPlatform);
  
  let testCheckpoint = new Checkpoint(0,30,-10,1,1);
  platforms.push(testCheckpoint);
  
  makePath(5,30,10,-1,0,0,10);
  
  movingPlatform = new MovingPlatform(0,3,0,300,-5,30,-10,1,1,random(360),100,100,0,0,0);
  platforms.push(movingPlatform);
  
  movingPlatform = new MovingPlatform(0,-3, 0,300,-5,50,-10, 1, 1,random(360),100,100,0,0,0);
  platforms.push(movingPlatform);
  
  makePath(-4,50,10,1,0,0,5);
  testCheckpoint = new Checkpoint(1,50,-10,1,1);
  platforms.push(testCheckpoint);
  //testCheckpoint.spawnHere();
  makePath(2,50,10,2,2,0,5);
  makePath(12,56,10,2,-2,0,9);
  makePath(30,37,10,1,0,0,3);
  makePath(30,38,10,1,0,0,3);
  makePath(30,39,10,1,0,0,3);
  makeIcyPath(34,38,10,0,1,0,10);
  makeIcyPath(35,38,10,0,1,0,10);
  makeIcyPath(36,38,10,0,1,0,10);
  
  makeIcyPath(36,48,10,1,0,0,10);
  makeIcyPath(36,49,10,1,0,0,10);
  makeIcyPath(36,50,10,1,0,0,10);
  makeIcyPath(36,51,10,1,0,0,10);
  
  makeIcyPath(46,51,10,0,-1,0,20);
  makeIcyPath(47,51,10,0,-1,0,20);
  makeIcyPath(48,51,10,0,-1,0,20);
  
  testCheckpoint = new Checkpoint(47,30,-10,1,1,0.42);
  platforms.push(testCheckpoint);
  
  
  makePath(46,31,10,1,0,0,3);
  makePath(46,30,10,1,0,0,3);
  makePath(46,29,10,1,0,0,3);
  
  let bp = new BouncePad(47,27,-10,1,1);
  platforms.push(bp);
  
  makePath(50,26,15,1,0,0,5);
  makePath(50,27,15,1,0,0,5);
  makePath(50,28,15,1,0,0,5);
  
  let horizontal = 1;
  let vertical = 0;
  let dH = 1;
  let dV = -1;
  let startX = 55;
  let startY = 27;
  for(let i = 0; i < 4; i++){
    makePath(startX,startY,15+3*i,horizontal,vertical,1,3);
    startX+=dH*2;
    startY+=dV*2;
    if(horizontal != 1 && horizontal != -1){
     horizontal+=dH;
    } else{
      dH*=-1;
      horizontal+=dH;
    }
    if(vertical != 1 && vertical != -1){
     vertical+=dV;
    } else{
      dV*=-1;
      vertical+=dV;
    }
    
  }
  makePath(50,28,27,0,1,0,20);
  makePath(51,28,27,0,1,0  ,20);
  
  
  
  testCheckpoint = new Checkpoint(50,48,-27,1,1);
  platforms.push(testCheckpoint);
}

function draw() {
  background(180+playerZ/gridSpace,100,100);
  
  translate(camXP, camYPFactor * camYP - playerZ, 0.7* camYP + 0.5 * playerZ); 
  rotateX(-HALF_PI-PI/5);
  rotateZ(0);
  isGrounded = grounded();
  noStroke();
 
  for(let i = 0; i < platforms.length; i++){
    platforms[i].show();  
  }
  img3D(0,10,1,10,10,arrowImg,HALF_PI);
  img3D(16,5,1,10,1,spacebarImg,PI * 3/4);
  
  stroke(1);
  fill(0,80,80);
 
  box3D(playerX,playerY,playerZ,gridSpace-10,gridSpace-10,gridSpace-10);
  airMovement();
  receiveInput();
  playerX += xMomentum/2;
  playerY += yMomentum/2;
  camXP -= xMomentum/2;
  camYP += yMomentum/2;
  if(xMomentum > 0){
    xMomentum -= 0.1; 
  } else if(xMomentum < 0){
    xMomentum+=0.1;
  }

  if(yMomentum > 0){
    yMomentum -= 0.1; 
  } else if(yMomentum < 0){
    yMomentum+=0.1;
  }
  if(playerZ > 1000){ //failsafe in the case the player falls off
    playerX = spawnX;
    playerY = spawnY;
    playerZ = spawnZ-gridSpace/2;
    camXP = -spawnX;
    camYP = spawnY;
    xMomentum = 0;
    yMomentum = 0;
  }
}

function airMovement(){
  if(isGrounded && airMomentum <= 0){
    airMomentum = 0;
  } else{
    playerZ -= airMomentum;
    airMomentum--;
  } 
}

function receiveInput(){
  let yAngle = camY;
  //console.log(yAngle/PI);
  if(yAngle >= PI/4 && yAngle < PI/4 * 3){
    if (keyIsDown(37)) {
      playerY += playerSpeed;
    }

    if (keyIsDown(39)) {
      playerY -= playerSpeed;
    }

    if (keyIsDown(38)) {
      playerX += playerSpeed;
    }

    if (keyIsDown(40)) {
      playerX -= playerSpeed;
    }
  } else if(yAngle >= PI/4 * 3 && yAngle < PI/4 * 5){
    if (keyIsDown(37)) {
      playerX += playerSpeed;
    }

    if (keyIsDown(39)) {
      playerX -= playerSpeed;
    }

    if (keyIsDown(38)) {
      playerY -= playerSpeed;
    }

    if (keyIsDown(40)) {
      playerY += playerSpeed;
    }
  } else if(yAngle >= PI/4 * 5 && yAngle < PI/4 * 7){
    if (keyIsDown(37)) {
      playerY -= playerSpeed;
    }

    if (keyIsDown(39)) {
      playerY += playerSpeed;
    }

    if (keyIsDown(38)) {
      playerX -= playerSpeed;
    }

    if (keyIsDown(40)) {
      playerX += playerSpeed;
    }
  } else{
    if (keyIsDown(37)) {
      playerX -= playerSpeed;
      camXP += playerSpeed;
    }

    if (keyIsDown(39)) {
      playerX += playerSpeed;
      camXP -= playerSpeed;
    }

    if (keyIsDown(38)) {
      playerY += playerSpeed;
      camYP += playerSpeed;
    }

    if (keyIsDown(40)) {
      playerY -= playerSpeed;
      camYP -= playerSpeed;
    }
  }
  if (keyIsDown(32) && isGrounded) {
    airMomentum = 15;
  }
  /*
  if (keyIsDown(38)) {
    camX += PI/360;
    // if(camX > TWO_PI){
    //   camX = PI/360;
    // }
  }
  if (keyIsDown(40)) {
    camX -= PI/360;
    // if(camX < 0){
    //   camX = TWO_PI - PI/360;
    // }
  }
  if (keyIsDown(37)) {
    camY += PI/360;
    // if(camY < 0){
    //   camY = TWO_PI - PI/360;
    // }
  }
  if (keyIsDown(39)) {
    camY -= PI/360;
    // if(camY > TWO_PI){
    //   camY = PI/360;
    // }
  }
  */
  if(camY == TWO_PI){
    camY = 0; 
  }
  if(camY < 0){
    camY = TWO_PI - PI/360;
  }
} //Turns player input into actions

function grounded(){ //Returns True if character is not airborne
  for(let i = 0; i < platforms.length; i++){
    if(platforms[i].onPlat()){
      return true; 
    } 
  }
  return false;
}

class Platform {
  constructor(x,y,z,w=gridSpace,l=gridSpace,color = random(360),sat = 80,brightness = 80,xt = 0, yt = 0, zt = 0) {
    this.x = x * gridSpace;
    this.y = y * gridSpace;
    this.z = z * gridSpace;
    this.w = gridSpace*w;
    this.l = gridSpace*l;
    this.color = color;
    this.sat = sat;
    this.brightness = brightness;
    this.xt = xt;
    this.yt = yt;
    this.zt = zt;
  }
  
  show(){
    noStroke();
    fill(this.color,this.sat,this.brightness);
    rect3D(this.x,this.y,this.z,this.w,this.h,this.xt,this.yt,this.zt);
  }
  
  onPlat(){ //Confirms if player is on this platform
    if(collideRectRect(playerX - gridSpace/2,playerY - gridSpace/2,gridSpace,gridSpace,this.x - (this.w/2),this.y - (this.l/2),this.w,this.l)){
      if(playerZ + gridSpace/2 <= this.z && playerZ + gridSpace/2 - airMomentum >= this.z){
        playerZ = this.z - gridSpace/2;
      }
      if(playerZ + gridSpace/2 === this.z){
        return true;
      }
    }
  }
} //constructor(x,y,z,w,h,color,sat,brightness,xt = 0, yt = 0, zt = 0)

class BouncePad{
  constructor(x,y,z,w=gridSpace,l=gridSpace,xt = 0, yt = 0, zt = 0) {
    this.x = x * gridSpace;
    this.y = y * gridSpace;
    this.z = z * gridSpace;
    this.w = gridSpace*w;
    this.l = gridSpace*l;
    this.color = 60;
    this.sat = 70;
    this.brightness = brightness;
    this.xt = xt;
    this.yt = yt;
    this.zt = zt;
  }
  show(){
    noStroke();
    fill(this.color,this.sat,this.brightness);
    rect3D(this.x,this.y,this.z,this.w,this.h,this.xt,this.yt,this.zt);
  }
  onPlat(){ //Confirms if player is on this platform
    if(collideRectRect(playerX - gridSpace/2,playerY - gridSpace/2,gridSpace,gridSpace,this.x - (this.w/2),this.y - (this.l/2),this.w,this.l)){
      if(playerZ + gridSpace/2 <= this.z && playerZ + gridSpace/2 - airMomentum >= this.z){
        playerZ = this.z - gridSpace/2;
      }
      if(playerZ + gridSpace/2 === this.z){
        airMomentum = 30;
      }
    }
  }
}

class SlipperyPlatform{
  constructor(x,y,z,w=1,l=1) {
    this.x = x * gridSpace;
    this.y = y * gridSpace;
    this.z = z * gridSpace;
    this.w = gridSpace*w;
    this.l = gridSpace*l;
    this.color = 180;
    this.sat = 90;
    this.brightness = 90;
    this.xt = 0;
    this.yt = 0;
    this.zt = 0;
  }
  
  show(){
    noStroke();
    fill(this.color,this.sat,this.brightness);
    rect3D(this.x,this.y,this.z,this.w,this.h,this.xt,this.yt,this.zt);
    if(this.onPlat()){
      if (keyIsDown(37)) {
        xMomentum -= 0.5;
      }

      if (keyIsDown(39)) {
        xMomentum += 0.5;
      }

      if (keyIsDown(38)) {
        yMomentum += 0.5;
      }

      if (keyIsDown(40)) {
        yMomentum -= 0.5;
      }
    }
  }
  
  onPlat(){ //Confirms if player is on this platform
    if(collideRectRect(playerX - gridSpace/2,playerY - gridSpace/2,gridSpace,gridSpace,this.x - (this.w/2),this.y - (this.l/2),this.w,this.l)){
      if(playerZ + gridSpace/2 <= this.z && playerZ + gridSpace/2 - airMomentum >= this.z){
        playerZ = this.z - gridSpace/2;
      }
      if(playerZ + gridSpace/2 === this.z){
        airMomentum=0;
        return true;
        
      }
    }
  }
}

class Checkpoint {
  constructor(x,y,z,w=gridSpace,l=gridSpace,factor = 0.5, xt = 0, yt = 0, zt = 0) {
    this.x = x * gridSpace;
    this.y = y * gridSpace;
    this.z = z * gridSpace;
    this.w = gridSpace*w;
    this.l = gridSpace*l;
    this.factor = factor;
    this.xt = xt;
    this.yt = yt;
    this.zt = zt;
  }
  
  spawnHere(){
    spawnX = this.x;
    spawnY = this.y;
    spawnZ = this.z; 
  }
  
  show(){
    noStroke();
    img3D(this.x/gridSpace+1, this.y/gridSpace, (-this.z+120)/gridSpace, 2,2, flag,HALF_PI);
    console.log(this.x);
    fill(100);
    rect3D(this.x,this.y,this.z,this.w,this.h,this.xt,this.yt,this.zt);
  }
  
  onPlat(){ //Confirms if player is on this platform
    if(collideRectRect(playerX - gridSpace/2,playerY - gridSpace/2,gridSpace,gridSpace,this.x - (this.w/2),this.y - (this.l/2),this.w,this.l)){
      if(playerZ + gridSpace/2 <= this.z && playerZ + gridSpace/2 - airMomentum >= this.z){
        playerZ = this.z - gridSpace/2;
      }
      if(playerZ + gridSpace/2 === this.z){
        spawnX = this.x;
        spawnY = this.y;
        spawnZ = this.z;
        camYPFactor = this.factor;
        return true;
      }
    }
  }
}

class MovingPlatform {
  constructor(xDirection,yDirection,zDirection,duration,x,y,z,w=gridSpace,l=gridSpace,color = 100,sat = 80,brightness = 80,xt = 0, yt = 0, zt = 0) {
    this.xDirection = xDirection;
    this.yDirection = yDirection;
    this.zDirection = zDirection;
    this.duration = duration;
    this.x = x * gridSpace;
    this.y = y * gridSpace;
    this.z = z * gridSpace;
    this.w = gridSpace*w;
    this.l = gridSpace*l;
    this.color = color;
    this.sat = sat;
    this.brightness = brightness;
    this.xt = xt;
    this.yt = yt;
    this.zt = zt;
    this.timer = 0;
    this.origX = this.x;
    this.origY = this.y;
    this.origZ = this.z;
  }
  
  show() {
    noStroke();
    if (frameCount%this.duration < this.duration/2) {
      this.x += this.xDirection;
      this.y += this.yDirection;
      this.z += this.zDirection;
      if(this.onPlat()){
        playerX += this.xDirection;
        playerY += this.yDirection;
        playerZ -= this.zDirection;
        camXP -= this.xDirection;
        camYP += this.yDirection;
      }
    } else {
      this.x -= this.xDirection;
      this.y -= this.yDirection;
      this.z -= this.zDirection;
      if(this.onPlat()){
        playerX -= this.xDirection;
        playerY -= this.yDirection;
        playerZ += this.zDirection;
        camXP += this.xDirection;
        camYP -= this.yDirection;
      }
    }
    fill(this.color,this.sat,this.brightness);
    rect3D(this.x,this.y,this.z,this.w,this.h,this.xt,this.yt,this.zt);
  }
  
  onPlat() { //Confirms if player is on this platform
    if(collideRectRect(playerX - gridSpace/2,playerY - gridSpace/2,gridSpace,gridSpace,this.x - (this.w/2),this.y - (this.l/2),this.w,this.l)){
      if(playerZ + gridSpace/2 <= this.z + this.zDirection && playerZ + gridSpace/2 - airMomentum >= this.z + this.zDirection){
        playerZ = this.z - gridSpace/2;
      }
      if(playerZ + gridSpace/2 === this.z){
        return true;
      }
    }
  }
}

function makePath(x, y, z, xSpacing, ySpacing, zSpacing, numSteps, w=1, h=1){
  for(let i = 0; i < numSteps; i++){
    let platform = new Platform(x + xSpacing*i,y + ySpacing*i,(z + zSpacing*i) *-1,w,h,random(360),100,100); 
    platforms.push(platform);
  }
}

function makeIcyPath(x, y, z, xSpacing, ySpacing, zSpacing, numSteps, w=1, h=1){
  for(let i = 0; i < numSteps; i++){
    let platform = new SlipperyPlatform(x + xSpacing*i,y + ySpacing*i,(z + zSpacing*i) *-1,w,h); 
    platforms.push(platform);
  }
}

function circle3D(x, y, z, r, xt = 0, yt = 0, zt = 0){
  push();
  translate(x,y,z);
  
  rotateY(yt);
  rotateZ(zt);
  rotateX(xt + HALF_PI);
  
  cylinder(r, 1);
  pop();
  
}

function rect3D(x, y, z, w, h, xt = 0, yt = 0, zt = 0){
  push();
  translate(x,y,z);
  // translate(x - width/2,z,y - height/2);
  
  rotateY(yt);
  rotateZ(zt);
  rotateX(xt);
  
  plane(w, h);
  pop();
  
}

function img3D(x, y, z, w, h, img, xt = 0, yt = 0, zt = 0){
  push();
  translate(x*gridSpace,y*gridSpace,z*gridSpace*-1);
  // translate(x - width/2,z,y - height/2);
  texture(img);
  rotateY(yt);
  rotateZ(zt);
  rotateX(xt);
  
  plane(w * gridSpace, h * gridSpace);
  
  pop();
  
}

function box3D(x,y,z,w,h,l,xt = 0, yt = 0, zt = 0){
  push();
  translate(x,y,z);
  rotateY(yt);
  rotateZ(zt);
  rotateX(xt);
  box(w,h,l);
  pop();
}