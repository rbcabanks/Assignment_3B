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
  '  gl_Position = u_ProjectionMatrix*u_ViewMatrix*  u_GlobalRotateMatrix* u_ModelMatrix * a_Position;\n' +
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
const allPoints=[];
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
let float=10;
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
let u_PickedFace=0;

let gAnimalGlobalRotation=90; // was 40
let gAnimalGlobalRotationy=0;
function addActionsForUI() { // used this resource "https://www.w3schools.com/howto/howto_js_rangeslider.asp"
 //document.getElementById('camera').addEventListener('mousemove', function () {gAnimalGlobalRotation=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 //document.getElementById('rLeg').addEventListener('mousemove', function () {g_rLeg=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 //document.getElementById('lLeg').addEventListener('mousemove', function () {g_lLeg=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 //document.getElementById('wings').addEventListener('mousemove', function () {wings=this.value; renderScene();}); //g_selectedColor[0]=this.value/100;
 //document.getElementById('on').onclick = function () {animate=true};
 //document.getElementById('off').onclick = function () {animate=false};
 
 if(totalPoints!=10){
  sendTextToHTML(totalPoints, "points")}
  else{
  sendTextToHTML("You Win!", "points")
}
  
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
  g_camera=new Camera(canvas.width/canvas.height,.1,500);

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
  //gl.uniformMatrix4fv(u_ModelMatrix, false, new Matrix4().elements);
  //gl.uniformMatrix4fv(u_ViewMatrix, false, new Matrix4().elements);
  //gl.uniformMatrix4fv(u_ProjectionMatrix, false, new Matrix4().elements);
  
}

function updateAnimationAngles(){
  if(animate==true){
    //wings=10*Math.sin(g_seconds*2);
    float=10*Math.sin(g_seconds/30);
  }

}
var g_map=[
  [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,1,0,2,0,0,0,0,1,0,2,0,1],
  [1,0,0,1,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,1,1,1,1,0,0,0,1,0,0,0,1],
  [1,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,2,0,0,0,1,1,1,1,1,0,0,0,1],
  [1,1,1,1,0,0,0,0,0,0,0,0,0,0,1],
  [1,2,0,1,0,0,0,0,2,0,0,0,2,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,0,0,0,1,0,1,0,0,2,0,0,1],
  [1,1,1,1,0,0,1,1,1,1,1,0,0,0,1],
  [1,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
  [1,2,0,0,0,0,0,0,2,0,1,0,2,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,0,0,0,1]
];
let len=0;
let floatingCubes=[]
let floatingCubeCoords=[]
let moveX=0
let moveZ=0

function drawMap(g_map){
  floatingCubes=[]
 
  for(x=0;x<15;x++){
    for(y=0;y<15;y++){
      //console.log(x,y);
      //console.log(x,2,y);
      if(g_map[x][y]==1){
        var body = new Matrix4();
        var translateK=new Matrix4();
        translateK.setTranslate(x,2,y-1.0);
        scaleM=new Matrix4();
        scaleM.setScale(.5,3,.5);
        body.multiply(translateK);
        body.multiply(scaleM);
        let uv=[
          0,0, 0,2, 2,.3,
          0,0, 2,1, 1,0,
        ]
        gl.uniform1i(u_whichTexture,-1);
        drawCubeUV(body,uv);
      }

      if(g_map[x][y]==2){
        var translaM=new Matrix4();
        var scalM=new Matrix4();

        var floatingcube = new Matrix4();
        
        translaM=new Matrix4();
        translaM.setTranslate(x,0,y-1.0);
        floatingcube.multiply(translaM);
        scalM=new Matrix4();
        scalM.setScale(.5,.5,.5);
        floatingcube.multiply(scalM);
        if (!floatingCubes.includes(floatingcube)) {
          floatingCubes.push(floatingcube);
          if (!floatingCubeCoords.includes([x,y])) {
            floatingCubeCoords.push([x,y]);
          }
        }
      }
    }
/*
    console.log(g_camera.at.elements[0]);
    var cube=new Matrix4();
    var cub32=new Matrix4();
    rgba=[0.0,1,0.5,1.0];
    gl.uniform1i(u_whichTexture,4);
    cube.translate(g_camera.at.elements[2]+5,g_camera.at.elements[1],g_camera.at.elements[0]);
    //cube.multiply(cub32);
    drawCube(cube);*/
  }
  //console.log(floatingCubes.length);
}
function renderScene(){
  gl.clear(gl.COLOR_BUFFER_BIT);
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
  scaleM.setScale(32,.1,32);
  modelMatrix1.multiply(scaleM);
  translateM.setTranslate(0,-20,0);
  modelMatrix1.multiply(translateM);
  
  rgba=[0.0,0.5,0.5,1.0];
  gl.uniform1i(u_whichTexture,-3);
  gl.activeTexture(gl.TEXTURE1);
  drawCubeUV(modelMatrix1,uv);
  //drawCube(modelMatrix1);

//sky
  scaleM=new Matrix4();
  modelMatrix=new Matrix4();
  scaleM.setScale(300,300,300);
  modelMatrix.multiply(scaleM);
  translateM.setTranslate(0,.1,0);
  modelMatrix.multiply(translateM);
  gl.uniform1i(u_whichTexture,0);
  drawCubeUV(modelMatrix,uv);


  drawMap(g_map);

  for(let x=0;x<floatingCubes.length;x++){

            //x= 0-15
            //y= 0-15
            //each floating cube is at (x+3, (float/20) , y-1.5) location;

    translateM=new Matrix4();
    translateM.setTranslate(0,(float/20),0)
    floatingCubes[x].multiply(translateM);

    var colors = new Uint8Array(2);
    //colors[0]=;//floatingCubeCoords[x][0];
    colors[1]=0;//floatingCubeCoords[x][1];
    const decimalToHex = dec => dec.toString(16);
    colors[0]=floatingCubeCoords[x][0];
    colors[1]=floatingCubeCoords[x][1];
    
    rgba=[0,0,0,1];
    //rgba=[0,0,0,1];
    gl.uniform1i(u_whichTexture,-2);
    drawCube(floatingCubes[x]);
  }
  

  var duration = performance.now()-startTime;
  sendTextToHTML(("ms:" + Math.floor(duration)+" fps:"+ Math.floor(10000/duration)/10), "numdot")
}

function renderAllShapes() {
  g_camera.setLook();
  gl.uniformMatrix4fv(u_ProjectionMatrix,false,g_camera.projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix,false,g_camera.viewMatrix.elements);

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


  /*
  console.log(a,c)
  var x=a-3;
  var y=c+1.5;
  console.log(x,y)
  if(g_map[x][y]==2){
    g_map[x][y]=0;
  }*/


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

let lastX = -1;
let lastY = -1;


function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForUI();
  
  document.onkeydown=keydown;
  canvas.addEventListener('mousemove', 
  function(ev) 
  {
    initEventHandlers(ev);
  });
   
  var currentAngle = 0.0; // Current rotation angle
  // Register the event handler
  canvas.onmousedown = function(ev) {   // Mouse is pressed
    var rect = ev.target.getBoundingClientRect();
    var x_in_canvas = (ev.clientX) - rect.left, y_in_canvas = rect.bottom - (ev.clientY);
    var pixels = new Uint8Array(4); // Array for storing the pixel value
    gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const decimalToHex = dec => dec.toString(16);

    var picked=false;
    //console.log(pixels);
    if (pixels[0] == 0) {// The mouse in on cube if R(pixels[0]) is 255
      picked = true;
    }
  
     if (picked){
      console.log("eye",g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2]-2)
      console.log("at",g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2])

      for(var x=0;x<floatingCubes.length;x++){
        //console.log(floatingCubeCoords[x][1]-1,float/20,(floatingCubeCoords[x][0]*-1)-1);
        /*console.log("ff",floatingCubeCoords[x][1]-1,g_camera.at.elements[0]);
        console.log("fe",(floatingCubeCoords[x][0]*-1.)-1,g_camera.at.elements[2]);*/
        console.log("x",x,"floatingCubeCoords[x][1]-1",(floatingCubeCoords[x][1]-1),"floatingCubeCoords[x][0]*-1)-1",(floatingCubeCoords[x][0]*-1)-1);

        console.log("xy -1<x<1",(floatingCubeCoords[x][1]-1)-g_camera.at.elements[0]," -1.5<z<2 ",((floatingCubeCoords[x][0]*-1)-1)-g_camera.at.elements[2]);
        if(((((floatingCubeCoords[x][1]-1)-g_camera.at.elements[0])<=1) && (((floatingCubeCoords[x][1]-1)-g_camera.at.elements[0])>=-1.5)) && ((((floatingCubeCoords[x][0]*-1)-1)-g_camera.at.elements[2]>=-1.5) && (((floatingCubeCoords[x][0]*-1)-1)-g_camera.at.elements[2]<=2)))
          {
            //console.log("xx",(floatingCubeCoords[x][1]-1)-g_camera.at.elements[0],((floatingCubeCoords[x][0]*-1)-1)-g_camera.at.elements[2]);

            //console.log(floatingCubeCoords[x][1]-1)-g_camera.at.elements[0];
            //console.log("fc",floatingCubeCoords[x][1],float/20,(floatingCubeCoords[x][0]));
            console.log("XY -1<x<1",(floatingCubeCoords[x][1]-1)-g_camera.at.elements[0]," -1.5<z<2 ",((floatingCubeCoords[x][0]*-1)-1)-g_camera.at.elements[2]);
            console.log("gmap delete",g_map[floatingCubeCoords[x][0]][floatingCubeCoords[x][1]], floatingCubeCoords[x][0], floatingCubeCoords[x][1]);
            if (g_map[floatingCubeCoords[x][0]][floatingCubeCoords[x][1]]!=0)
              g_map[floatingCubeCoords[x][0]][floatingCubeCoords[x][1]]=0;
            console.log("gmap after delete",g_map[floatingCubeCoords[x][0]][floatingCubeCoords[x][1]], floatingCubeCoords[x][0], floatingCubeCoords[x][1]);

            //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
            renderScene();

            if(totalPoints!=10){
              totalPoints=totalPoints+1;
              sendTextToHTML(totalPoints, "points")}
              else{
              sendTextToHTML("You Win!", "points")
            }

          }
        }
      }
     picked=false;
  }


  initTextures(gl,0);
  renderScene();

  // Specify the color for clearing <canvas>  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  requestAnimationFrame(tick);
}

 
var g_startTime=performance.now()/20;
var g_seconds=performance.now()/20-g_startTime;

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

  console.log("my eye",g_camera.eye.elements);
  console.log("my at",g_camera.at.elements);
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
      if(dy < -0.05) {
          //g_camera.at.elements[1] += 1;
          g_camera.panDown();
      } else if (dy > 0.05) {
          //g_camera.at.elements[1] -= 1;
          g_camera.panUp();
      }
  }
  lastX = x;
  lastY = y;

}

const sleepNow = (delay) => new Promise ((resolve) => setTimeout(resolve,delay));

function tick(){
  g_seconds=performance.now()/200-g_startTime;
  updateAnimationAngles();
  renderScene();
  sleepNow (1000);
  requestAnimationFrame(tick);
}