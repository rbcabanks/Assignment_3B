// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = u_ViewMatrix* u_ProjectionMatrix* u_GlobalRotateMatrix* u_ModelMatrix * a_Position;\n' +
  //'gl_Position =a_Position;\n'+
  '  gl_PointSize = u_Size;\n' +
  '  v_UV = a_UV; \n'+
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor; 
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform float u_texColorWeight;
  void main() {
    if(u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }
    else if(u_whichTexture == -1){
      gl_FragColor=vec4(v_UV,1,1);
    }
    else if(u_whichTexture == 0){
      float t= u_texColorWeight;
      vec4 texColor=texture2D(u_Sampler0,v_UV);
      vec4 baseColor=vec4(0,0,1,1);
      gl_FragColor = t*baseColor+t*texColor;
    }
    else if(u_whichTexture == -3){
      float t= u_texColorWeight;
      vec4 texColor=texture2D(u_Sampler1,v_UV);
      vec4 baseColor=vec4(0,0,.1,1);
      gl_FragColor = t*baseColor+t*texColor;
    }
    else{
      gl_FragColor=vec4(1,.2,.2,1);
    }

  }`; 
  
// global variables
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let totalPoints=0;
let canvas;
let display2;
let gl;
let rgba;
let a_Position;
let u_FragColor;
let u_Size;
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10;
let g_selectedType = POINT;
let g_segment=10;
let g_camera;
let g_width=0.0;
let g_height=0.0;
let g_fliph=false;
let g_flipv=false;
let g_eql=false
var g_shapesList = [];
let bonsaiSaveArray=[]
let refImage=document.getElementById('img2')
let u_ModelMatrix;
let g_rLeg=15;
let g_lLeg=15;
let wings=10;
let moveUp; 
let moveBack; 
let moveBackL; 
let aboveN=1.8; 
let aboveN2=1.8; 
var k=.03
let moveBottom;
let checkgr=0;
let rotateNr=0;
let checkg=0;
let rotateN=0;
let moveBottomL;
let u_Sampler0;
let u_Sampler1;
let animate=true;
let u_texColorWeight;
let a_UV;



let gAnimalGlobalRotation=120; // was 40
let gAnimalGlobalRotationy=0;
function addActionsForUI() { // used this resource "https://www.w3schools.com/howto/howto_js_rangeslider.asp"
 //document.getElementById('camera').addEventListener('mousemove', function () {gAnimalGlobalRotation=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 //document.getElementById('rLeg').addEventListener('mousemove', function () {g_rLeg=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 //document.getElementById('lLeg').addEventListener('mousemove', function () {g_lLeg=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 //document.getElementById('wings').addEventListener('mousemove', function () {wings=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 //document.getElementById('on').onclick = function () {animate=true};
 //document.getElementById('off').onclick = function () {animate=false};
 sendTextToHTML(totalPoints, "points")
}


function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }); // magic runtime code

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  g_camera=new Camera(canvas.width/canvas.height,.1,1000);

}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_texColorWeight = gl.getUniformLocation(gl.program, 'u_texColorWeight');
  if (!u_texColorWeight) {
    console.log('Failed to get the storage location of u_texColorWeight');
    return;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, new Matrix4().elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, new Matrix4().elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, new Matrix4().elements);
  
}

function updateAnimationAngles(){
  if(animate==true){
    //g_rLeg=45*Math.sin(g_seconds);
    wings=10*Math.sin(g_seconds*2);
    //g_lLeg=-45*Math.sin(g_seconds);
  }

}

function renderScene(){

  let translateAll=0;
  var startTime=performance.now();
  updateAnimationAngles();
  renderAllShapes();
  
  //gl.uniform1i(u_texColorWeight,0.8);

  let translateM= new Matrix4();
  let rotateM= new Matrix4();
  let scaleM= new Matrix4();
  let modelMatrix = new Matrix4();

//floor

let uv=[
  0,0,0,1,1,1,
  0,0,1,1,1,0,
]

let modelMatrix1=new Matrix4();
scaleM.setScale(50,.1,50);
modelMatrix1.multiply(scaleM);
translateM.setTranslate(0,-20,0);
modelMatrix1.multiply(translateM);
rgba=[0.0,0.2,0.5,1.0];
gl.uniform1i(u_whichTexture,-3);
//gl.activeTexture(gl.TEXTURE1);
drawCubeUV(modelMatrix1,uv);

//sky
  modelMatrix=new Matrix4();
  scaleM.setScale(1000,1000,1000);
  modelMatrix.multiply(scaleM);
  translateM.setTranslate(0,.5,0);
  modelMatrix.multiply(translateM);
  gl.uniform1i(u_whichTexture,0);
  drawCubeUV(modelMatrix,uv);

  /*
  // cube
  modelMatrix=new Matrix4();
  scaleM.setScale(1,1,1);
  modelMatrix.multiply(scaleM);
  translateM.setTranslate(0,0,-8);
  modelMatrix.multiply(translateM);

  rgba=[0,.0,1,1];
  gl.uniform1i(u_whichTexture,-2);
  drawCube(modelMatrix);

  // floating cube
  modelMatrix=new Matrix4();
  scaleM.setScale(.3,.3,.3);
  modelMatrix.multiply(scaleM);
  translateM.setTranslate(6,0,3);
  modelMatrix.multiply(translateM);

  rgba=[0,.0,1,1];
  gl.uniform1i(u_whichTexture,-3);
  drawCube(modelMatrix);
  */

  var g_map=[
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,2,0,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,2,0,0,1],
    [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,2,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,2,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,1,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,2,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3],
  ];
  
  drawMap(g_map);
    var duration = performance.now()-startTime;
    sendTextToHTML(("ms:" + Math.floor(duration)+" fps:"+ Math.floor(10000/duration)/10), "numdot")
  
  }
let Jerries=[]
function drawMap(g_map){
  for (x=0;x<32;x++){
    for(y=0;y<32;y++){
      if(g_map[x][y]==1){
        var body = new Matrix4();
        body.setTranslate(x-2,-.75,y-2);
        var scaleM=new Matrix4();
        scaleM.setScale(.5,2,.5);
        body.multiply(scaleM);

        if((x==0 && y==0)||(x==0 && y==1)||(x==0 && y==2)||(x==32 && y==30)||(x==32 && y==31)||(x==32 && y==32)){
          rgba=[1,.0,0,1];
          gl.uniform1i(u_whichTexture,-2);
          drawCube(body);
        }
        else if((x==32 && y==30)||(x==32 && y==31)||(x==32 && y==32)){
          rgba=[1,.0,0,1];
          gl.uniform1i(u_whichTexture,-2);
          drawCube(body);
        }
        else{
          let uv=[
            0,0, 0,.5, .5,.5,
            0,0,.5,.5, 1,0,
          ]
          gl.uniform1i(u_whichTexture,-1);
          drawCubeUV(body,uv);
        }
      }
  
      if(g_map[x][y]==2){
        Jerry = new Flamingo();
        Jerry.x= x;
        Jerry.y=-1
        Jerry.z= y;
        //Jerry.rotate(Math.sin(g_seconds/2)*10,0,0,1);
        let k= new Matrix4(Math.sin(g_seconds/2)*10,0,0,1);
        Jerry.rotX.set(k);
        Jerries.push(Jerry);
      }
    }
  }
}

function renderAllShapes() {
  gl.uniformMatrix4fv(u_ViewMatrix,false,g_camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix,false,g_camera.projectionMatrix.elements);

  let globalRotMat=new Matrix4().rotate(gAnimalGlobalRotation,gAnimalGlobalRotationy,1,0);
  //globalRotMat.rotate(gAnimalGlobalRotationy,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);

  var xformMatrix = new Matrix4();
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); //
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, xformMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

}
function sendTextToHTML(text,htmlID){
  var htmlElm=document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID+" from HTML");
    return;
  }
  htmlElm.innerHTML=text;
}

//from textbook

function initTextures(gl, n) {
  var texture = gl.createTexture();   // Create a texture object
  var texture2 = gl.createTexture();

  if (!texture || !texture2) {
    console.log('Failed to create the texture object');
    return false;
  }

  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }

  var u_Sampler0=gl.getUniformLocation(gl.program,"u_Sampler0");
  var u_Sampler1=gl.getUniformLocation(gl.program,"u_Sampler1");

  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(gl, n, texture, u_Sampler0, image,0); };
  image1.onload = function(){ loadTexture(gl, n, texture2, u_Sampler1, image1,1); };


  // Tell the browser to load an image
  image.src = 'sky_cloud.jpg';
  image1.src = 'grass.jpg';

  return true;
}
//send texture to glsl
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  if(texUnit==0){
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit_0=true;
  }
  else{
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit_1=true;
  }
  
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit to the sampler
  gl.uniform1i(u_Sampler, texUnit);
  
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

}
/*var eye=new Vector3([0,0,1.4]);
var at=new Vector3([0,0,-1.0]);
var up=new Vector3([0,1,0]);
var w=new Vector3(0.0,0.0,0.0);
*/
let lastX = -1;
let lastY = -1;


function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForUI();
  
  document.onkeydown=keydown;
  canvas.addEventListener('mousemove', function(ev) {initEventHandlers(ev)});

  initTextures(gl,0);
  renderScene();

  // Specify the color for clearing <canvas>  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  requestAnimationFrame(tick);
} 

let currentAngle=[0.0,0.0]; 
var g_startTime=performance.now()/240;
var g_seconds=performance.now()/240-g_startTime;

function keydown(ev) {
  if(ev.keyCode == 87) { // The w key was pressed
    //console.log("here");
    g_camera.moveForward();
    //var w= new Vector3();

    //console.log("after Forward "+eye.elements[2]);
  }else
  if (ev.keyCode == 83) { // The s key was pressed
    g_camera.moveBackward();

    //console.log("after backward "+eye.elements[2]);
  }else
  if(ev.keyCode == 65) { // The a key was pressed
    g_camera.moveLeft();
    
  }else
  if (ev.keyCode == 68) { // The d key was pressed
    g_camera.moveRight();
  }else
  if (ev.keyCode == 81) { // The q key was pressed
    g_camera.panLeft();
    
  }
  else if (ev.keyCode == 69) { // The e key was pressed
    g_camera.panRight();
  }


  var x = ev.clientX;
  var y = ev.clientY;
  let JerPos = [];
  JerPos.push(Math.round(g_camera.at.elements[0]) + 16);
  JerPos.push(Math.round(g_camera.at.elements[1]) - -1);
  JerPos.push(Math.round(g_camera.at.elements[2]) + 16);
/*
  if(e.button == 2) {
    // Right click = place block
    setBlock(blockPos[0], blockPos[1], blockPos[2], TEXTURES.TEXTURE2);
  } else if(e.button == 0) {
    // Left click = remove block
    removeJerry(blockPos[0], blockPos[1], blockPos[2]);
  }*/
  if(ev.keyCode==67) { // left click
    /*this.chunk.deleteBlock(cx, cy, cz);
    this.chunk.deleteBlock(cx + cx_offset, cy, cz + cz_offset);
    this.chunk.deleteBlock(cx + cx_offset, cy-1, cz + cz_offset);  */
    //drawCube(cx + cx_offset, cy, cz + cz_offset, 2);  
    //removeJerry(blockPos[0], blockPos[1], blockPos[2]);
    console.log(JerPos[0],JerPos[1],JerPos[2]);
  }

  //initTextures(gl,0);
  renderScene();
}
var g_MvpMatrix = new Matrix4(); // Model view projection matrix
////var lastX = -1;
////var lastY = -1;
var globalRotMat1=new Matrix4();
var dragging = false;         // Dragging or not
     // Last position of the mouse
  

function initEventHandlers(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
  if(ev.buttons == 1) {
      var factor = 100/canvas.height;
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      if(dx > 0.1) {
          g_camera.panLeft();
      } else if (dx < -0.1) {
          g_camera.panRight();
      }
      if(dy < -0.1) {
          g_camera.at.elements[1] += 1;
          //g_camera.panUp();
      } else if (dy > 0.1) {
          g_camera.at.elements[1] -= 1;
          //g_camera.panDown();
      }
  }
  lastX = x;
  lastY = y;

}

function tick(){
  g_seconds=performance.now()/240-g_startTime;
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}