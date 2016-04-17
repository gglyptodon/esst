var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });
var bg;
function preload() {

    //bg
    game.load.image('sky', 'assets/skyfun.png');
    // elderly shapeshifting samurai tortuga
    game.load.spritesheet('tortuga_small', 'assets/tortuga_small.png', 68, 35);
    game.load.spritesheet('tortuga_bouncy', 'assets/tortuga_bouncy.png', 68, 57);
    game.load.spritesheet('tortuga_hide', 'assets/tortuga_hide.png', 68, 35);
    game.load.spritesheet('tortuga_samurai', 'assets/tortuga_samurai.png', 68, 52);
    game.load.spritesheet('tortuga_tentacle', 'assets/tortuga_tentacle.png', 68, 38);
    game.load.spritesheet('tortuga_saw', 'assets/tortuga_saw.png', 68, 36);
    game.load.spritesheet('tortuga_mine', 'assets/tortuga_mine.png', 68, 41);
    game.load.spritesheet('tortuga_wings', 'assets/tortuga_wings.png', 68, 57);
    game.load.spritesheet('tortuga_tentacleR', 'assets/tortuga_tentacleR.png', 38, 68);
    game.load.spritesheet('tortuga_tentacleU', 'assets/tortuga_tentacleU.png', 68, 38);
    //actions
    game.load.spritesheet('tortuga_hide', 'assets/tortuga_hide.png', 68, 35);
    game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);

    //items
    game.load.image('star', 'assets/star.png');
    game.load.image('food', 'assets/firstaid.png');

    // sounds
    game.load.audio('bgmusic', ['assets/sounds/Shinobi_3_Oboro_Drive_OC_ReMix.ogg']);
//    game.load.audio('boing', ['assets/sounds/boing2.ogg']);
//    game.load.audio('saw', ['assets/sounds/saw2.ogg']);
    game.load.audio('sword', ['assets/sounds/sword.ogg']);
    game.load.audio('transform', ['assets/sounds/transform.ogg']);

    game.load.image('tiles-1', 'assets/tilemap.png');

    game.load.tilemap('level1', 'assets/maps/level0.json', null, Phaser.Tilemap.TILED_JSON);

    //added for timer
    game.load.image('knightHawks', 'assets/fonts/KNIGHT3.png');
    game.load.image('gameover', 'assets/gameover.png');



}

var player;
var cursors;
var explosions;
var stars;
var foods;
var score = 0;
//var scoreText;

var xvel = 150;
var yvel = 50;
var bouncy_y = 0.2;
var bouncy_x = 0.3;
var gravity_y = 300;


var player2;
var cursors_p2;
var score_p2 = 0;
//var scoreText;

var xvel_p2 = 150;
var yvel_p2 = 50;
var bouncy_y_p2 = 0.2;
var bouncy_x_p2 = 0.3;
var gravity_y_p2 = 300;


var shape_choices = ['tortuga_small','tortuga_samurai', 'tortuga_saw', 'tortuga_bouncy', 'tortuga_mine', 'tortuga_tentacle', 'tortuga_wings'];

var time_font;
var score_font;
var total = 30;
var stateText;


function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    makeLevel(1);
    map = game.add.tilemap('level1');
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    map.addTilesetImage('lkj', 'tiles-1');
    //create layer
    blockedlayer = map.createLayer('Tile Layer 1');
    //collision on blockedLayer
    map.setCollisionBetween(1, 600, true, 'Tile Layer 1');
    //  Un-comment this on to see the collision tiles

    //blockedlayer.debug = true;

    //resizes the game world to match the layer dimensions
    blockedlayer.resizeWorld();

    // timer
    time_font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    score_font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    gameover_font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    //for (var c = 1; c < 19; c++)
    //{
//    var time_txt = game.add.image(game.world.centerX,  16, time_font);
    var time_txt = game.add.image(500,  16, time_font);
    var score_txt = game.add.image(0, 16, score_font);//'score: 0', { fontSize: '32px', fill: '#000' });
    var gameover_txt = game.add.image(150, 300, gameover_font);
    gameover_txt.fixedToCamera = true;
    score_txt.fixedToCamera = true;
    time_txt.fixedToCamera = true;
    //stateText = game.add.image(0, 16, time_font);
    //stateText.anchor.setTo(0.5, 0.5);
    //stateText.visible = false;

        //  Create our Timer
    timer = game.time.create(false);

    //  Set a TimerEvent to occur after 2 seconds
    timer.loop(1000, updateCounter, this);

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.


    timer.start();


    //272px × 57
    //288px × 48px
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = bouncy_y;
    player.body.bounce.x = bouncy_x;
    player.body.gravity.y = gravity_y;
    //console.log(player.body.gravity.y, "gravityy");
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2,3], 10, true);

    //  An explosion pool
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');
    });
    //  Finally some stars to collect
    stars = game.add.group();
    foods = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;
    foods.enableBody = true;

    for (var i = 0; i < 30; i++)
    {
        for (var j=0; j < 10; j++)
        {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, j * 100, 'star');
    
            //  Let gravity do its thing
            star.body.gravity.y = 300;
    
            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.3 + Math.random() * 0.6;
            star.body.velocity.x = 0 + Math.random() * 20 * choice([-1,1])*choice([0,1]);
            star.body.velocity.y = 0 + Math.random() * 10 * choice([-1,1])*choice([0,1]);
        }
    }
    for (var i = 0; i < 10; i++)
    {
        for (var j=0; j < 3; j++)
        {
            var food = foods.create(i * 70, j * 100, 'food');

            //  Let gravity do its thing
            food.body.gravity.y = 200;

            //  This just gives each star a slightly random bounce value
            food.body.bounce.y = 0.5 + Math.random() * 0.6;
            food.body.velocity.x = 0 + Math.random() * 20 * choice([-1,1]);
            food.body.velocity.y = 0 + Math.random() * 10;
        }
    }


    //  The score
    //scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    // sound effects
    music = game.add.audio('bgmusic');

    //boing = game.add.audio('boing');
    //saw = game.add.audio('saw');

    sword = game.add.audio('sword');
    transform = game.add.audio('transform');

    music.play();
    game.camera.follow(player);

}
function displayGameOver(){
    //console.log("gameover");
    pictureGameOver.loadTexture('pictureGameOver');
}

function updateCounter() {

    total--;

}

function update() {

    //  Collide the player and the stars with the platforms
    //game.physics.arcade.collide(player, platforms);
    //game.physics.arcade.collide(stars, platforms);
    //game.physics.arcade.collide(player, blockedlayer);
    game.physics.arcade.collide(stars, blockedlayer);
    game.physics.arcade.collide(foods, blockedlayer);

    // check for burnt in explosion things
    game.physics.arcade.overlap(explosions, blockedlayer, burnBlocks, null, this);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, foods, collectFood, null, this);
    game.physics.arcade.overlap(player, blockedlayer, destroyBlocks, null, this);
    //game.physics.arcade.overlap(player, platforms, destroyBlocks, null, this);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.angle = 0; 
    //console.log(player.key);

    if (player.key == "tortuga_wings" && cursors.up.isDown){
        //console.log("ttt");
        player.body.velocity.y = -xvel;
    }

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -xvel;

        player.animations.play('left');
        //console.log(xvel, yvel, gravity_y, bouncy_x, bouncy_y,player.body.bounce.y );
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = xvel;
        //console.log("xv", xvel);

        player.animations.play('right');
    }

    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.blocked.down) 
    {
        player.body.velocity.y = -yvel;
    }
    if (canTentacleClimb(player))
    {
        player.body.velocity.y = -xvel/1.5
    } 
    //  Explode the mine turtle on space press
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && player.key == "tortuga_mine")
    { 
//        var explosion = explosions.create(player.x - player.width/2, player.y - player.height, 'explosion'); //todo, predeclare in preload and then select later
//        explosion.animations.add('explode', [0, 4], 10, false);
//        explosion.animations.play('explode');
        burnBlocks(player, blockedlayer);
    }
    // Check hot keys for changing sprites
    if (game.input.keyboard.isDown(Phaser.Keyboard.ONE))
    {
        shapeshift(player, shape_choices[1]);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.TWO))
    {
        shapeshift(player, shape_choices[2]);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.THREE))
    {
        shapeshift(player, shape_choices[3]);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.FOUR))
    {
        shapeshift(player, shape_choices[4]);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.FIVE))
    {
        shapeshift(player, shape_choices[5]);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.SIX))
    {
        shapeshift(player, shape_choices[6]);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.SEVEN))
    {
        shapeshift(player, shape_choices[7]);
    }


    //scroll bg
    bg.tilePosition.x -=0.5;
    time_font.text = "Time: " + total;
    score_font.text = "Score: "+score;
    if (total < 1){
        player.kill();
        timer.stop();
        gameover_font.text = "Time Up! Score: "+score;
        gameover_font.visible = true;
        music.stop();
    }
}

function render(){
     //game.debug.body(player);
    // game.debug.inputInfo(32, 32);


    //game.debug.text('Time until event: ' + timer.duration.toFixed(0), 32, 32);
    //game.debug.text('Loop Count: ' + total, 32, 64);

}

// 
function canTentacleClimb(aplayer){
    ret = false;
    // check player form
    tentacle_keys = ["tortuga_tentacle", "tortuga_tentacleR", "tortuga_tentacleU"]
    if (tentacle_keys.indexOf(aplayer.key) >= 0)
    {
        // check if we are blocked by a wall or ceiling
        if (aplayer.body.blocked.right || aplayer.body.blocked.left)
        {
            ret = true;
            if (aplayer.key != "tortuga_tentacleR")
            {
                shapeshift(player, 'tortuga_tentacleR');
                if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
                {
                    player.body.x = player.body.x - 30;
		    //console.log("DEB x-30 ",player.x, player.body.x);
                }

            }
        
        }
        else if (aplayer.body.blocked.up)
        {
            ret = true;
            if (aplayer.key != "tortuga_tentacleU")
            {
                shapeshift(player, 'tortuga_tentacleU');

            } 
           
        }
        else
        {
            if (aplayer.key != "tortuga_tentacle")
            {
                shapeshift(player, 'tortuga_tentacle');

            }

        }

    }

    return ret;
}

// probably more what the explosion should look like, TODO
// a thanks to https://github.com/jschomay/phaser-demo-game/blob/873b9a19f39af9155a822da70f9935c58f8d0d64/game.js
function burnBlocks(player, blockedlayer) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
    explosion.body.velocity.y = player.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    shapeshift(player, choice(shape_choices));
  //  blockedlayer.kill(); todo, select blocks under explosion
}


function collectStar (player, star) {
    // Removes the star from the screen
    star.kill();
    shapeshift(player, choice(shape_choices));
    //  Add and update the score
    score += 10;
    //scoreText.text = 'Score: ' + score;

}
function collectFood(player, food){
    food.kill();
    total +=3;
    score +=15;
}
function destroyBlocks(player, block){
    //console.log('destroyblocks', player, block);
    if(player.key == 'tortuga_samurai'){
        removeTile(player, block);
    }
}
removeTile = function(player, tile){   tile.alpha = 0;
    tile.collideDown = false;   tile.collideUp = false;   tile.collideRight = false;
    tile.collideLeft = false;   blockedlayer.dirty = true;};
//update = function(){    game.physics.arcade.collide(player, tile_layer, removeTile);};


function shapeshift(player, newkey) {
    function reset_defaults(){ 
        player.loadTexture('tortuga_small', 0);
        bouncy_y = 0.2;
        bouncy_x = 0.2;
        gravity_y = 300;
        xvel = 150;
        yvel = 50;
        player.body.checkCollision.left = true;
        player.body.checkCollision.right = true;
        player.body.checkCollision.top = true;
        player.body.checkCollision.bottom = true;

        //player.animations.add('left', [0, 1], 10, true);
        //player.animations.add('right', [2,3], 10, true);
    }
    function set_tortuga_bouncy(){
        reset_defaults();
        player.loadTexture('tortuga_bouncy', 0);
        bouncy_y = 1.0;
        bouncy_x = 0.9;
        gravity_y = 50;
        xvel = 150;
        yvel = 350;
        player.body.bounce.y = bouncy_y;
        player.body.bounce.x = bouncy_x;
        player.body.gravity.y = gravity_y;
    }
    function set_tortuga_samurai(){
        reset_defaults();
        player.loadTexture('tortuga_samurai', 0);
        xvel = 350;
        player.body.checkCollision.left = false;
        player.body.checkCollision.right = false;
    }
    function set_tortuga_small(){
        reset_defaults();
        player.loadTexture('tortuga_small', 0);

    }
    function set_tortuga_saw(){
        reset_defaults();
        player.loadTexture('tortuga_saw', 0);
        xvel = 750;

    }
    function set_tortuga_mine(){
        reset_defaults();
        player.loadTexture('tortuga_mine', 0);

    }
    function set_tortuga_tentacle(){
        reset_defaults();
        player.loadTexture('tortuga_tentacle', 0);
    }
    // rotated tentacle for climbing
    function set_tortuga_tentacleR(){
        reset_defaults();
        player.loadTexture('tortuga_tentacleR', 0);
    }
    // upsidedown for going along ceiling
    function set_tortuga_tentacleU(){
        reset_defaults();
        player.loadTexture('tortuga_tentacleU', 0);
    }  
    function set_tortuga_wings(){
        reset_defaults();
        player.loadTexture('tortuga_wings',0)
    }
    function set_tortuga_hide(){
        reset_defaults();
        player.loadTexture('tortuga_hide', 0);
    }

    transform.play();
    //console.log(newkey);
    switch (newkey) {
        case 'tortuga_small':
            set_tortuga_small();
            break;
        case 'tortuga_hide':
            set_tortuga_hide();
            break;
        case 'tortuga_bouncy':
            //boing.play();
            set_tortuga_bouncy();

            break;
        case 'tortuga_samurai':
            set_tortuga_samurai();
            break;
        case 'tortuga_saw':
            set_tortuga_saw();
            break;
        case 'tortuga_mine':
            set_tortuga_mine();
            break;
        case 'tortuga_tentacle':
            set_tortuga_tentacle();
            break;
        case 'tortuga_tentacleR':
            set_tortuga_tentacleR();
            break;
        case 'tortuga_tentacleU':
            set_tortuga_tentacleU();
            break;
        case 'tortuga_wings':
            set_tortuga_wings();
        default:
            console.log("");
    }
    player.body.y = player.body.y - (player.height - player.body.height)
    player.body.height = player.height; // to keep different sized sprites going through the floor
    player.body.bounce.y = bouncy_y;
    player.body.bounce.x = bouncy_x;
    player.body.gravity.y = gravity_y;
    // make sure body and texture match
    player.body.y = player.body.y - (player.height - player.body.height);
    player.body.height = player.height;
    player.body.x = player.body.x - (player.width - player.body.width);
    player.body.width = player.width;
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2,3], 10, true);


    //player.animations.add('left', [0, 1], 10, true);
    //player.animations.add('right', [2,3], 10, true);
}

function makeLevel(level) {
    switch (level) {
        case 1:
            //console.log(level);
            //  A simple background for our game
            bg = game.add.tileSprite(0, 0,800,600, 'sky');
            bg.scale.setTo(4, 4);

            //  The platforms group contains the ground and the 2 ledges we can jump on
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;

            // The player and its settings
            player = game.add.sprite(32, game.world.height - 150, 'tortuga_small');
            // The player and its settings

            //  Finally some stars to collect
            stars = game.add.group();

            //  We will enable physics for any star that is created in this group
            stars.enableBody = true;

            //  Here we'll create 12 of them evenly spaced apart
            for (var i = 0; i < 12; i++) {
                //  Create a star inside of the 'stars' group
                var star = stars.create(i * 70, 0, 'star');

                //  Let gravity do its thing
                star.body.gravity.y = 300;

                //  This just gives each star a slightly random bounce value
                star.body.bounce.y = 0.7 + Math.random() * 0.2;
                star.body.bounce.x = 0.7 + Math.random() * 0.2;
            }


            break;

        case 2:
            //  A simple background for our game
            game.add.sprite(0, 0, 'sky');

            //  The platforms group contains the ground and the 2 ledges we can jump on
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;

            // Here we create the ground.
            var ground = platforms.create(0, game.world.height - 64, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(2, 2);

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;

            //  Now let's create two ledges
            var ledge = platforms.create(400, 400, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(-150, 250, 'ground');
            ledge.body.immovable = true;

            // The player and its settings
            player = game.add.sprite(32, game.world.height - 150, 'tortuga_small');

        default:
            console.log(level);
    }

}
function choice(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
