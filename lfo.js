window.addEventListener("load",function() {

	var D = new Date();
	//var startTime = D.getTime();

	var Q = window.Q = Quintus( {development: true} )
			.include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, Components")
			.setup({ maximize: true })
			.controls().touch()

	Q.Sprite.extend("Player",{

	  init: function(p) {

		this._super(p, {
			sheet: "player"
		});

		this.add('2d, betterPlatformerControls');

		this.on("hit.sprite",function(collision) {

		  if(collision.obj.isA("Door")) {
			Q.stageScene("endGame",1, { label: "You Won!" }); 
			this.destroy();
		  }
		});
	
		this.on("bump.bottom",this,"ride");

	  },
  
	  ride: function(collision) {
		if(collision.obj.isA("Platform")) {
		  this.p.vx = 500;
		}
	  },

	  step: function(dt) {
		if(this.p.y > 600) {
		  Q.stageScene("endGame",1, { label: "You Fell!" });
		  this.destroy();
		}

		if(this.p.vy > 600) { this.p.vy = 600; }
	
	  }

	});
	
 	Q.Sprite.extend("Oscillator", {
 		init: function(p) {
 			this._super(p, { sheet: 'oscillator' });
 			this.frequency = 0.25;
 		},
 		
	  	step: function(dt) {
	    	D = new Date();
	    	var curTime = D.getTime();
	    	this.oscPos = Math.sin((((curTime - startTime) / 1000) * 2 * Math.PI) * this.frequency);
	  		//this.p.x = this.initialX + 150 * oscFactor;
	  	}		
	});
	
	
	Q.Sprite.extend("Controller", {
		init: function(p) {
			this._super(p, { sheet: 'controller' });
		},
		
		step: function(p) {
			if (this.p.connectedOsc) {
				this.controlPos = this.p.connectedOsc.oscPos;
			}
		}
	});


	Q.Sprite.extend("Door", {
	  init: function(p) {
		this._super(p, { sheet: 'door' });
	  }
	});


	Q.Sprite.extend("Platform",{
	  init: function(p) {
		this._super(p, { sheet: 'platform' });
		this.add('2d');
		this.p.gravity = 0;
		
		this.initialX = this.p.x;
		this.range = 150;
		//this.p.myController = null;
	  },
	  
	  step: function(p) {
	      if (this.p.myController) {
	          this.p.x = this.initialX + this.range * this.p.myController.controlPos;
	      }
	  }
	});


	Q.scene("level1",function(stage) {

		stage.collisionLayer(new Q.TileLayer({
								 dataAsset: 'level1.json',
								 sheet:     'tiles' }));

		startTime = D.getTime();

		var player = stage.insert(new Q.Player({ x: 410, y: 190 }));

		stage.add("viewport").follow(player);

		stage.insert(new Q.Door({ x: 1024, y: 240 }));
		
		var osc1 = stage.insert(new Q.Oscillator({ x: 200, y: 240 }));
		
		var controller1 = stage.insert(new Q.Controller({ x: 300, y: 240, connectedOsc: osc1 }));

		stage.insert(new Q.Platform({ x: 590, y: 260, myController: controller1 }));
	});


	Q.scene('endGame',function(stage) {
	  var container = stage.insert(new Q.UI.Container({
		x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	  }));

	  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
													  label: "Play Again" }))         
	  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
													   label: stage.options.label }));
	  button.on("click",function() {
		Q.clearStages();
		Q.stageScene('level1');
	  });

	  container.fit(20);
	});

	Q.load("sprites.png, sprites.json, level1.json, tiles.png", function() {
	  Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });

	  Q.compileSheets("sprites.png","sprites.json");

	  Q.stageScene("level1");
	});


});