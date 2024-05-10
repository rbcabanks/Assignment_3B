class Camera {
  constructor(aspectRatio,near,far) {
    this.fov =60.0;
    this.eye=new Vector3([0,0,1.4]);
    this.at=new Vector3([0,0,-1.1]);
    this.up=new Vector3([0,1,0]);
    this.speed = 0.2;

    //this.updateView();
    this.projectionMatrix=new Matrix4();
    this.projectionMatrix.setPerspective(this.fov,aspectRatio,near,far);
    //this.projectionMatrix.setPerspective(174,1,.1,1000);
    
    gl.uniformMatrix4fv(u_ProjectionMatrix,false,this.projectionMatrix.elements);

    this.viewMatrix=new Matrix4();
    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);

   //gl.uniformMatrix4fv(u_ProjectionMatrix,false,this.projectionMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);

  }
  moveForward(){
    var w = new Vector3(0.0,0.0,0.0);
    console.log("w ",w);
   
    console.log("at ",this.at);
    w.set(this.at);
    console.log("eye ",this.eye);
    console.log("f set ",w);
    w.sub(this.eye);
    console.log("f sub ",w);
    w.normalize();
    console.log("f norm ",w);
    w.mul(.05);
    console.log("f mul ",w);
    this.eye.add(w);
    console.log("eye  add",this.eye);
    this.at.add(w);
    console.log("at add",this.at);
    console.log("f ",w);
    
    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);

  }
  moveBackward(){
    var w = new Vector3(0.0,0.0,0.0);
    w.set(this.eye);
    w.sub(this.at);
    w.normalize();
    w.mul(.05);
    this.at.add(w);
    this.eye.add(w);
    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);
  }
  moveLeft(){
    var w = new Vector3(0.0,0.0,0.0);
    w.set(this.at);
    w.sub(this.eye);
    w.normalize();
    w.mul(.05);
    var s = Vector3.cross(this.up, w);
    this.at.add(s);
    this.eye.add(s);
    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);
 }
  moveRight(){
    var r = new Vector3(0.0,0.0,0.0);  
    r.set(this.eye);
    r.sub(this.at);
    r.normalize();
    r.mul(.05);
    var s = Vector3.cross(this.up, r);
    this.at.add(s);
    this.eye.add(s);
    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);
  }
  panLeft(){
    gAnimalGlobalRotation=gAnimalGlobalRotation-.1;
    console.log("panLeft");
  }
  panRight(){
    gAnimalGlobalRotation=gAnimalGlobalRotation+.1;
    console.log("panRight");
  }
  panUp(){
    ////gAnimalGlobalRotationy=gAnimalGlobalRotationy+.1;
    /*var globalRotMat=new Matrix4().rotate(gAnimalGlobalRotation+2,1,0,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);
*/
    console.log("panUp");
    this.at.elements[1] += .1;
    
    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);
  }
  panDown(){
    ////gAnimalGlobalRotationy=gAnimalGlobalRotationy-.1;
    /*var globalRotMat=new Matrix4().rotate(gAnimalGlobalRotation-2,1,0,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix,false,globalRotMat.elements);
    */
    console.log("panDown");
    this.at.elements[1] -= .1;

    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);
    
  }
  
    
  
/*
*/
}/*
function keydown(ev) {
  if(ev.keyCode == 87) { // The w key was pressed
    //console.log("here");
    moveForward();
  }else
  if (ev.keyCode == 84) { // The s key was pressed
    moveBack();
  }else
  if(ev.keyCode == 65) { // The a key was pressed
    camera.moveLeft();
  }else
  if (ev.keyCode == 68) { // The d key was pressed
    camera.moveRight();
  }else
  if (ev.keyCode == 81) { // The q key was pressed
    //camera.moveLeft();
    gAnimalGlobalRotation=gAnimalGlobalRotation-2;
  }
  else if (ev.keyCode == 69) { // The e key was pressed
    gAnimalGlobalRotation=gAnimalGlobalRotation+2;
    //camera.moveRight();
  }
  //initTextures(gl,0);
  renderScene();
}*/