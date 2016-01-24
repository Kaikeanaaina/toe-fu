(function(){

  //private static varible
  var ANIMATIONS = {
    IDLE : {
      name : 'idle',
      frames : [0,1,2,3],
      fps : 5
    }
  };

  var FACING_FACTOR = {
    LEFT : -1,
    RIGHT : 1
  };

  var WALK_SPEED = 400;
  var JUMP_HEIGHT = 1230;
  var DIVE_SPEED = 400;
  var DIVE_DISTANCE = 400; // horizontal 'steps' per frame
  var DIVE_JUMP_TIMEOUT = 125; // ms after a dive that counts as a dive is still happening (and can jump again)`


  function select_sprite_row(player_id){
    return function(frame_id){
      return frame_id + player_id*ToeFu.ASSETS.SPRITESHEET.PLAYER.frames_per_row;
    };
  }

// sprite class contructor

ToeFu.Player = function(game, id, name) {
  this.game = game;
  this.id = id;
  this.name = name? name : 'Player '+(id+1);
  this.facing; // direction that player is facing, state updates this
  this.is_diving;

  //super constructor call
  Phaser.Sprite.call(this, game, 0, 0, ToeFu.ASSETS.SPRITESHEET.PLAYER.name);

  // enable physics (adds this.body)
  this.game.physics.enable(this, Phaser.Physics.ARCADE);

  // set center registration point
  this.anchor = { x : 0.5, y : 0.5};

  // set animations
  // set animations
    // if(this.id === 0){
    //   this.animations.add(ANIMATIONS.IDLE.name, ANIMATIONS.IDLE.frames );
    // } else {
    //   var frames = ANIMATIONS.IDLE.frames;
    //   for (var i = 0, len = frames.length; i < len; i++) {
    //     frames[i] = frames[i] + ToeFu.ASSETS.SPRITESHEET.PLAYER.frames_per_row;
    //   }
    //   this.animations.add(ANIMATIONS.IDLE.name, frames );
    // }
  this.animations.add(ANIMATIONS.IDLE.name, ANIMATIONS.IDLE.frames.map(select_sprite_row(this.id)));

  //took this out because it overwrites the add above this line
    //this.animations.add(ANIMATIONS.IDLE.name, ANIMATIONS.IDLE.frames);

  //play the initial animation
  this.animations.play(ANIMATIONS.IDLE.name, ANIMATIONS.IDLE.fps, true);

};

ToeFu.Player.prototype = Object.create(Phaser.Sprite.prototype, {
  constructor : {
    value : ToeFu.Player
  }
});

//public static variable
ToeFu.Player.FACING = {
  LEFT : 'LEFT',
  RIGHT : 'RIGHT'
};

//is invoked on every frame
ToeFu.Player.prototype.update = function(){

  // update facing
  this.scale.x = FACING_FACTOR[ this.facing ];

};

ToeFu.Player.prototype.jump = function(){
 // allow jumping from the floor (not in mid air)
    if( this.body.y === ToeFu.Game.FLOOR_Y ){
      this.body.velocity.y = -JUMP_HEIGHT;
    } else if( this.is_diving ){ // allow jump after dive (in mid air)
      this.body.velocity.y = -JUMP_HEIGHT*(this.body.y/ToeFu.Game.FLOOR_Y);
    }


};

ToeFu.Player.prototype.dive = function(){

if( this.body.y < ToeFu.Game.FLOOR_Y ){
      this.body.velocity.y = DIVE_SPEED;
      this.body.velocity.x = DIVE_DISTANCE * FACING_FACTOR[ this.facing ];
      this.is_diving = true;
    }else{
      this.body.velocity.y = 0;
      this.body.velocity.x = 0;
      this.is_diving = false;
    }

};

ToeFu.Player.prototype.dive_stop = function(){
// reset velocity
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    setTimeout(function(){
      this.is_diving = false;
    }.bind(this), DIVE_JUMP_TIMEOUT);
};

ToeFu.Player.prototype.step_left = function(){
 this.body.velocity.x = -WALK_SPEED;
};

ToeFu.Player.prototype.step_right = function(){
  this.body.velocity.x = WALK_SPEED;
};

ToeFu.Player.prototype.stop = function(){
 this.body.velocity.x = 0;
};

  // Custom methods

ToeFu.Player.prototype.victory = function(){
  this.is_diving = false;

  // make animation

};

ToeFu.Player.prototype.defeat = function(){

  // stop all input
  this.alive = false;

};




})();

