class Camera {
  constructor(aspectRatio,near,far) {
    this.fov =70.0;
    this.eye=new Vector3([0.0,0.0,1.0]);
    this.at=new Vector3([0.0,0.0,-1.0]);
    this.up=new Vector3([0.0,1.0,0.0]);
    this.speed = 1;

    //this.updateView();
    this.projectionMatrix=new Matrix4();
    this.resetPerspective(aspectRatio,near,far);
    //this.projectionMatrix.setPerspective(174,1,.1,1000);
    

    this.viewMatrix=new Matrix4();
    this.setLook();
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);


  }
  resetPerspective(aspectRatio,near,far){
    this.projectionMatrix.setPerspective(this.fov,aspectRatio,near,far);
  }
  setLook(){
    this.viewMatrix.setLookAt(
      this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
      this.at.elements[0],this.at.elements[1],this.at.elements[2],
      this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
  }
  moveForward(){
    //console.log(this.eye.elements);
    //moveX=moveX-1;
    //console.log(moveX);
    
    var f = new Vector3(0.0,0.0,0.0);            
    f.set(this.at);                 
    f.sub(this.eye);
    f.normalize();                  
    f.mul(this.speed);              
    this.eye.add(f);                
    this.at.add(f);                 
    this.setLook();
    //this.resetPerspective();

    /*var w = new Vector3(0.0,0.0,0.0);
    console.log("w ",w.elements);
   
    console.log("at ",this.at.elements);
    w.set(this.at);
    //this.at.set(w);
    console.log("eye ",this.eye.elements);
    console.log("f set ",w.elements);
    w.sub(this.eye);
    console.log("f sub ",w.elements);
    w.normalize();
    console.log("f norm ",w.elements);
    w.mul(this.speed);
    console.log("f mul ",w.elements);
    this.eye.add(w);
    console.log("eye  add",this.eye.elements);
    this.at.add(w);
    console.log("at add",this.at.elements);
    console.log("moveForward translate ");
    */
  }
  moveBackward(){
    
    var b = new Vector3;
    b.set(this.eye);
    b.sub(this.at);
    b.normalize();
    b.mul(this.speed);
    console.log(this.at.elements, this.eye.elements);
    this.at.add(b);
    this.eye.add(b);
    this.setLook();

    moveX=moveX+1;
    console.log(moveX);

    /*var w = new Vector3(0.0,0.0,0.0);
    w.set(this.eye);
    w.sub(this.at);
    w.normalize();
    w.mul(.05);
    this.at.add(w);
    this.eye.add(w);
    this.setLook();*/
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);
  }
  moveLeft(){
    var w = new Vector3(0.0,0.0,0.0);
    w.set(this.at);
    w.sub(this.eye);
    w.normalize();
    w.mul(this.speed);
    var s = Vector3.cross(this.up, w);
    this.at.add(s);
    this.eye.add(s);
    this.setLook();
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);
 }
  moveRight(){
    var r = new Vector3(0.0,0.0,0.0);  
    r.set(this.eye);
    r.sub(this.at);
    r.normalize();
    r.mul(this.speed);
    var s = Vector3.cross(this.up, r);
    this.at.add(s);
    this.eye.add(s);
    this.setLook();
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);
  }
  panLeft(){
    var left = new Vector3();
    left.set(this.at);
    left.sub(this.eye);
    let rotationMatrixL = new Matrix4();
		rotationMatrixL.setIdentity();
		rotationMatrixL.setRotate(3, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		let s = rotationMatrixL.multiplyVector3(left);
		this.at = s.add(this.eye);
  }
  panRight(){
    var right = new Vector3();
    right.set(this.at);
    right.sub(this.eye);
    let rotationMatrixR = new Matrix4();
		rotationMatrixR.setIdentity();
		rotationMatrixR.setRotate(-3, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		let k = rotationMatrixR.multiplyVector3(right);
		this.at = k.add(this.eye);
  }
  panUp(){
    this.at.elements[1] += .10;
    this.setLook();
  }
  panDown(){
    this.at.elements[1] -= .10;
    this.setLook(); 
    
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