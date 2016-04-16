var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render:render });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('dude1', 'assets/dude1.png', 32, 48);
    // elderly shapeshifting samurai tortuga
    game.load.spritesheet('tortuga_small', 'assets/tortuga_small.png', 68, 35);
    game.load.spritesheet('tortuga_bouncy', 'assets/tortuga_bouncy.png', 68, 57);
    game.load.spritesheet('tortuga_hide', 'assets/tortuga_hide.png', 68, 35);
    // sounds
    game.load.audio('bgmusic', ['assets/sounds/bgmusic1.ogg']);
    game.load.audio('boing', ['assets/sounds/boing2.ogg']);
    game.load.audio('saw', ['assets/sounds/saw2.ogg']);
    game.load.audio('sword', ['assets/sounds/sword.ogg']);
    game.load.audio('transform', ['assets/sounds/transform0.ogg']);


}

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

var xvel = 150;
var yvel = 50;
var bouncy_y = 0.2;
var bouncy_x = 0.3;
var gravity_y = 300;
function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

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
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

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
        player.body.velocity.x = -150;

        player.animations.play('left');
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

}
function render(){
     //game.debug.body(player);
     game.debug.inputInfo(32, 32);
}

function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();
    shapeshift(player);


    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}


function shapeshift(player) {
    transform.play();
    switch (player.key) {
        case 'tortuga_small':
            player.loadTexture('tortuga_hide', 0);

            bouncy_y = 0.2;
            bouncy_x = 0.2;
            gravity_y = 300;

            xvel = 150;
            yvel = 50;
            break;
        case 'tortuga_hide':
            boing.play();
            player.loadTexture('tortuga_bouncy', 0);
            xvel = 350;
            yvel = 350;
            bouncy_y = 1.0;
            bouncy_x = 0.9;
            gravity_y = 50;
            break;
        case 'tortuga_bouncy':
            player.loadTexture('tortuga_small', 0);
            xvel = 150;
            yvel = 10;
            bouncy_y = 0.2;
            bouncy_x = 0.2;
            gravity_y = 300;
            player.animations.add('left', [0, 1], 10, true);
            player.animations.add('right', [2,3], 10, true);
            break;
        default:
            console.log("");
    }

    player.body.bounce.y = bouncy_y;
    player.body.bounce.x = bouncy_x;
    player.body.gravity.y = gravity_y;


    //player = game.add.sprite(player.x, player.y, 'dude1');
    //
    //
    ////  We need to enable physics on the player
    //game.physics.arcade.enable(player);
    //
    ////  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    //player.body.gravity.y = 300;
    //player.body.collideWorldBounds = true;
    //
    ////  Our two animations, walking left and right.

    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [2,3], 10, true);
}