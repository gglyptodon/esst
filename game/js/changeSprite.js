var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });
var bg;
function preload() {

    game.load.image('sky', 'assets/level1.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('dude1', 'assets/dude1.png', 32, 48);
    // elderly shapeshifting samurai tortuga
    game.load.spritesheet('tortuga_small', 'assets/tortuga_small.png', 68, 35);
    game.load.spritesheet('tortuga_bouncy', 'assets/tortuga_bouncy.png', 68, 57);
    game.load.spritesheet('tortuga_hide', 'assets/tortuga_hide.png', 68, 35);
    game.load.spritesheet('tortuga_samurai', 'assets/tortuga_samurai.png', 68, 35);
    game.load.spritesheet('tortuga_tentacle', 'assets/tortuga_tetacle.png', 68, 57);
    game.load.spritesheet('tortuga_saw', 'assets/tortuga_saw.png', 68, 35);
    game.load.spritesheet('tortuga_mine', 'assets/tortuga_mine.png', 68, 35);

    // sounds
    game.load.audio('bgmusic', ['assets/sounds/bgmusic1.ogg']);
    game.load.audio('boing', ['assets/sounds/boing2.ogg']);
    game.load.audio('saw', ['assets/sounds/saw2.ogg']);
    game.load.audio('sword', ['assets/sounds/sword.ogg']);
    game.load.audio('transform', ['assets/sounds/transform0.ogg']);

    game.load.image('tiles-1', 'assets/tilemap.png');

    game.load.tilemap('level1', 'assets/maps/level0.json', null, Phaser.Tilemap.TILED_JSON);

    //added for timer
    game.load.image('knightHawks', 'assets/fonts/KNIGHT3.png');
    game.load.image('gameover', 'assets/gameover.png');



}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
//var scoreText;

var xvel = 150;
var yvel = 50;
var bouncy_y = 0.2;
var bouncy_x = 0.3;
var gravity_y = 300;

var shape_choices = ['tortuga_small','tortuga_samurai', 'tortuga_saw', 'tortuga_bouncy', 'tortuga_mine', 'tortuga_tentacle'];

var time_font;
var score_font;
var total = 5;
var stateText;
function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    makeLevel(1);
    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    layer.debug = true;

    //layer.resizeWorld();
    time_font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    score_font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    gameover_font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    //for (var c = 1; c < 19; c++)
    //{
    var time_txt = game.add.image(game.world.centerX,  16, time_font);

    var score_txt = game.add.image(0, 16, score_font);//'score: 0', { fontSize: '32px', fill: '#000' });
    var gameover_txt = game.add.image(game.world.centerX/2, game.world.centerY,gameover_font);
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
    console.log(player.body.gravity.y, "gravityy");
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2,3], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    //scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    // sound effects
    music = game.add.audio('bgmusic');
    boing = game.add.audio('boing');
     saw = game.add.audio('saw');
    sword = game.add.audio('sword');
    transform = game.add.audio('transform');

    music.play();

}
function displayGameOver(){
    console.log("gameover");
    pictureGameOver.loadTexture('pictureGameOver');
}

function updateCounter() {

    total--;

}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -xvel;

        player.animations.play('left');
        console.log(xvel, yvel, gravity_y, bouncy_x, bouncy_y,player.body.bounce.y );
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = xvel;
        console.log("xv", xvel);

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -yvel;
    }
    //scroll bg
    bg.tilePosition.x -=0.5;
    time_font.text = "Time: " + total;
    score_font.text = "Score: "+score;
    if (total < 1){
        player.kill();
        timer.stop();
        gameover_font.text = "Game Over";
        gameover_font.visible = true;
    }


}
function render(){
     //game.debug.body(player);
    // game.debug.inputInfo(32, 32);


    //game.debug.text('Time until event: ' + timer.duration.toFixed(0), 32, 32);
    //game.debug.text('Loop Count: ' + total, 32, 64);

}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();
    shapeshift(player, choice(shape_choices));


    //  Add and update the score
    score += 10;
    //scoreText.text = 'Score: ' + score;

}


function shapeshift(player, newkey) {
    function reset_defaults(){
        player.loadTexture('tortuga_small', 0);
        bouncy_y = 0.2;
        bouncy_x = 0.2;
        gravity_y = 300;
        xvel = 150;
        yvel = 50;
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
    function set_tortuga_hide(){
        reset_defaults();
        player.loadTexture('tortuga_hide', 0);
    }

    transform.play();
    console.log(newkey);
    switch (newkey) {
        case 'tortuga_small':
            set_tortuga_small();
            break;
        case 'tortuga_hide':
            set_tortuga_hide();
            break;
        case 'tortuga_bouncy':
            boing.play();
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
        default:
            console.log("");
    }

    player.body.bounce.y = bouncy_y;
    player.body.bounce.x = bouncy_x;
    player.body.gravity.y = gravity_y;

    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2,3], 10, true);


    //player.animations.add('left', [0, 1], 10, true);
    //player.animations.add('right', [2,3], 10, true);
}

function makeLevel(level) {
    switch (level) {
        case 1:
            console.log(level);
            //  A simple background for our game
            bg = game.add.tileSprite(0, 0,800,600, 'sky');

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

            //  Now let's create and scale two ledges
            var ledge = platforms.create(200, 0, 'ground');
            ledge.scale.setTo(0.3, 15);
            ledge.body.immovable = true;

            ledge = platforms.create(game.world.width - 200, 400, 'ground');
            ledge.scale.setTo(0.5, 5);
            ledge.body.immovable = true;

            // The player and its settings
            player = game.add.sprite(32, game.world.height - 150, 'tortuga_small');
            // The player and its settings
            //player = game.add.sprite(32, game.world.height - 150, 'dude');

            //  We need to enable physics on the player
            //game.physics.arcade.enable(player);

            //  Player physics properties. Give the little guy a slight bounce.
            //player.body.bounce.y = 0.2;
            //player.body.gravity.y = 300;
            //player.body.collideWorldBounds = true;

            //  Our two animations, walking left and right.
            //player.animations.add('left', [0, 1, 2, 3], 10, true);
            //player.animations.add('right', [5, 6, 7, 8], 10, true);

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