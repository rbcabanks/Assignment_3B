
class Flamingo {
    constructor() {
      this.type = 'Flamingo';
      this.x=[0];
      this.y=[0];
      this.z=[0];
      this.rotX=new Matrix4();
    }
    // rendering function... originally was in colorpoints render function
    render(){
        let translateM= new Matrix4();
        let rotateM= new Matrix4();
        let scaleM= new Matrix4();
        let modelMatrix = new Matrix4();

        let uv=[
        0,0,0,1,1,1,
        0,0,1,1,1,0,
        ]
/*
        translateM.setTranslate(0+this.x,-1.8+this.y,0+this.z);
        modelMatrix.multiply(translateM);
        scaleM.setScale(30,1,32);
        modelMatrix.multiply(scaleM);
        translateM.setTranslate(-.5+this.x,0+this.y,-.5+this.z);
        modelMatrix.multiply(translateM);
        rgba=[.1,.1,.7,1];
        //let modelMatrix=new Matrix4();
        drawCube(modelMatrix);

        modelMatrix = new Matrix4();
        translateM=new Matrix4();
        scaleM= new Matrix4();
*/        

        gl.uniform1i(u_whichTexture,-2);

        translateM.setTranslate(0+this.x,.5+this.y,+this.z);
        rotateM.setRotate(5,-.1,0,0);
        scaleM.setScale(.13,.1,.15);
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(this.rotX);
        modelMatrix.multiply(scaleM);
        rgba=[1,.1,.7,1];
        //head (1)

        drawCube(modelMatrix);

        translateM.setTranslate(-3+this.x,1.3+this.y,-2+this.z);
        //rotateM.setRotate(5,-.1,0,0);
        scaleM.setScale(1.1,.2,.2);
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(this.rotX);
        //modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.01,.01,.01,1];
        //eyes (2)

        drawCube(modelMatrix);


        //beak (3)
        translateM.setTranslate(0+this.x,.48+this.y,-.18+this.z);
        rotateM.setRotate(-5,.1,0,0);
        scaleM.setScale(.07,.06,.03);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(this.rotX);
        modelMatrix.multiply(scaleM);
        rgba=[.7,.7,.7,1];
        drawCube(modelMatrix);

        //beak (white front) (4)
        translateM.setTranslate(0+this.x,.50+this.y,-.27+this.z);
        rotateM.setRotate(-5,.1,0,0);
        scaleM.setScale(.07,.02,.07);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.7,.7,.7,1];
        drawCube(modelMatrix);

        //beak (black) (5)
        translateM.setTranslate(0+this.x,.42+this.y,-.3+this.z);
        rotateM.setRotate(-5,.1,0,0);
        scaleM.setScale(.07,.07,.03);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.02,.02,.02,1];
        drawCube(modelMatrix);

        //beak (black) (6)
        translateM.setTranslate(0+this.x,.40+this.y,-.25+this.z);
        rotateM.setRotate(-5,.1,0,0);
        scaleM.setScale(.07,.07,.06);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.02,.02,.02,1];
        drawCube(modelMatrix);


        //neck (7)
        translateM.setTranslate(0+this.x,.2+this.y,.025+this.z);
        rotateM.setRotate(10,.1,0,0);
        scaleM.setScale(.07,.27,.07);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.9,.1,.7,1];
        drawCube(modelMatrix);

        //body (8)
        translateM.setTranslate(0+this.x,-.06+this.y,.2+this.z);
        scaleM.setScale(.165,.18,.26);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        //modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.8,.1,.6,1];
        drawCube(modelMatrix);


        if(wings==10){
        moveUp=0;
        }
        else{
        moveUp=(wings-10)/1200;
        }
        //left wing bottom (9)
        translateM.setTranslate((-.2-moveUp/2)+this.x,(-.04+moveUp)+this.y,.2+this.z);
        rotateM.setRotate(5+wings/2,0,0,-.15);
        scaleM.setScale(.02,.16,.26);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.8,.1,.5,1];
        drawCube(modelMatrix);

        //right wing bottom (10)
        translateM.setTranslate((.2+moveUp/2)+this.x,(-.04+moveUp)+this.y,.2+this.z);
        rotateM.setRotate(-(5+wings/2),0,0,-.15);
        scaleM.setScale(.02,.16,.26);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.8,.1,.5,1];
        drawCube(modelMatrix);

        if(g_lLeg==15){
        moveBackL=0;
        }
        else{
        moveBackL=(g_lLeg-15)/500;
        }

        //right leg (11)
        if(g_rLeg==15){
        moveBack=0;
        }
        else{
        moveBack=(g_rLeg-15)/500;
        }

        translateM.setTranslate(.055+this.x,-.3+this.y,.25+(moveBack)+this.z);
        rotateM.setRotate(g_rLeg,-.5,0,0);
        scaleM.setScale(.03,.17,.03);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.6,.3,.6,1];
        drawCube(modelMatrix);

        //right joint (12)
        var rLegMatrix=new Matrix4();
        rLegMatrix.set(modelMatrix);
        rLegMatrix.scale(1.6,.28, 1.7);
        //    lLegMatrix.translate(-3.2+this.x,-2.6+this.y,-2.3+this.z);

        rLegMatrix.translate(-3+this.x,-2.6+this.y,-2.3+this.z);
        rLegMatrix.rotate(g_rLeg/1.5,.5,0,0);
        rgba=[.8,.1,.6,1];
        drawCube(rLegMatrix);


        //right bottom part of leg (13)
        if(g_rLeg>3){
        if(checkgr<.26){
            checkgr=g_rLeg/500
            rotateNr=g_rLeg
            moveBottom=0;
        }
        }
        else if(-3<g_rLeg<3){
        checkgr=-g_rLeg/670
        rotateNr=g_rLeg*-.6;
        if(moveBottom>-.3){
            moveBottom=g_rLeg/160;
        }
        }

        translateM.setTranslate(.055+this.x,-.6+(checkgr)+this.y,.25+(moveBottom)+this.z);
        rotateM.setRotate(rotateNr,1,0,0);
        rLegMatrix.scale(.8,1, .8);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.6,.3,.6,1];
        drawCube(modelMatrix);


        let footr=new Matrix4();
        footr.set(modelMatrix);
        footr.translate(0+this.x,-.3+this.y,-.9+this.z);
        footr.scale(1,.1,3.1);
        rgba=[.6,.3,.6,1];
        drawCube(footr);

        //-------------------------------------------------------------------
        translateM.setIdentity();
        scaleM.setIdentity();
        rotateM.setIdentity();

        //left leg (14)
        translateM.setTranslate(-.055+this.x,-.3+this.y,.25+(moveBackL)+this.z);
        rotateM.setRotate(g_lLeg,-.5,0,0);
        scaleM.setScale(.03,.17,.03);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.6,.3,.6,1];
        drawCube(modelMatrix);


        //left joint (15)
        var lLegMatrix=new Matrix4();
        lLegMatrix.set(modelMatrix);
        lLegMatrix.scale(1.6,.28, 1.8);
        lLegMatrix.translate(-3.2+this.x,-2.6+this.y,-2.3+this.z);
        lLegMatrix.rotate(g_lLeg/1.5,.5,0,0);
        rgba=[.8,.1,.6,1];
        drawCube(lLegMatrix);

        //left bottom part of leg (16)
        if(g_lLeg>3){
        if(checkg<.26){
            checkg=g_lLeg/500
            rotateN=g_lLeg
            moveBottomL=0;
        }
        }
        else if(-3<g_lLeg<3){
        checkg=-g_lLeg/670
        rotateN=g_lLeg*-.6;
        if(moveBottomL>-.3){
            moveBottomL=g_lLeg/160;
        }
        }

        translateM.setTranslate(-.055+this.x,-.6+(checkg)+this.y,.25+(moveBottomL)+this.z);
        rotateM.setRotate(rotateN,1,0,0);
        scaleM.setScale(.03,.17,.03);
        modelMatrix.setIdentity();
        modelMatrix.multiply(translateM);
        modelMatrix.multiply(rotateM);
        modelMatrix.multiply(scaleM);
        rgba=[.6,.3,.6,1];
        drawCube(modelMatrix);

        let footl=new Matrix4();
        footl.set(modelMatrix);
        footl.translate(0+this.x,-.3+this.y,-.9+this.z);
        footl.scale(1,.1,3.1);
        rgba=[.6,.3,.6,1];
        drawCube(footl);
    }
}