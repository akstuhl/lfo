//character controller with acceleration
//Add animation keyframes to this component

Quintus.Components = function(Q){

/////Better Controls for Player ////
Q.component("betterPlatformerControls", {
    defaults: {
      speed: 150,
      jumpSpeed: -400
    },

    added: function() {
      var p = this.entity.p;

      Q._defaults(p,this.defaults);

      this.entity.on("step",this,"step");
      this.entity.on("bump.bottom",this,"landed");

	  p.vxMax = 400;
	  p.vxMin = 1;
      p.accelx = 1500;
      p.friction = 0.15;
      p.landed = 0;
      p.doubleJump = 0; //0 - off, 1 - on & unprimed, 2 - on and primed, 3 - on and used
      p.direction ='right';
    },

    landed: function(col) {
      var p = this.entity.p;
      p.landed = 1/5;
      if(p.doubleJump > 0){p.doubleJump = 1};
    },

    step: function(dt) {
      var p = this.entity.p;

      if(Q.inputs['left']) {
        p.ax = -p.accelx
        if(Math.abs(p.vx) > p.vxMax){p.ax = 0; p.vx = -p.vxMax;};
        //p.direction = 'left';
        //this.entity.play("running");
      } else if(Q.inputs['right']) {
        //p.direction = 'right';
        p.ax = p.accelx
        //this.entity.play("running");
        if(Math.abs(p.vx) > p.vxMax){p.ax = 0; p.vx = p.vxMax;};
      } else {
      	p.ax = 0;
        p.vx = p.vx*(1-p.friction);
        if(Math.abs(p.vx)<p.vxMin){p.vx=0};
        //this.entity.play("standing");
      }

      if((Q.inputs['up'] || Q.inputs['action'])) {
      	if(p.landed > 0){
        	p.vy = p.jumpSpeed;
        	p.landed = -dt;
        }else if(p.doubleJump == 2){
        	p.vy = p.jumpSpeed;
        	p.doubleJump = 3;
        	console.log("Boost");
        	//p.landed = -dt;
        }
      }else if(p.doubleJump==1){p.doubleJump = 2}
      p.landed -= dt;
    }
  });
  
////////  
}