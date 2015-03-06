/*global filters*/

var SpriteBuilder = function(game) {

    //game.load.spritesheet('character', 'assets/character.png', 450, 750);
    game.load.image('wall', 'assets/WallBasic.png');
    game.load.atlasJSONHash('ball', 'assets/rigidObjects/ball.png', 'assets/rigidObjects/ball.json');
    game.load.image('ground', 'assets/Grass_01.png'); // muutetaan skeneen sopivaksi. nyt aina grass.
    game.load.image('tree', 'assets/tiles/Tree_01.png'); // muutetaan skeneen sopivaksi. nyt aina grass.
    game.load.image('objectShadow', 'assets/shadow.png');
    game.load.image('teleEffectSprite', 'assets/tiles/teleportEffect.png');
   // game.load.image('bgtile', 'assets/background.jpg');
    game.load.atlasJSONHash('character', 'assets/character/character.png', 'assets/character/character.json');
    game.load.image('hitParticle', 'assets/particles/hitParticle.png');
    game.load.image('teleportPad', 'assets/tiles/TeleportPad.png');
    this.spriteMultiplier =1;

    this.defaultWidth = 16;
    this.defaultHeight = 16;
    
    console.log(game.stage.width);

    var backgroundGoup = game.add.group();
    var groundGroup = game.add.group();
    var aboveGroundGroup = game.add.group();
    var backEffectsGroup = game.add.group();
    var particleGroup = game.add.group();
    var objectGroup = game.add.group();
    var frontEffectsGroup = game.add.group();
    
    
    
    
    this.update = function() {
        objectGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    }
    
    
    this.generateSprite = function(entity, list) {
 

        switch (entity.imageId) {
            
            case '0': //player
                
                entity.shadowSprite = new Phaser.Sprite(game, entity.lastX, entity.lastY, 'objectShadow');
                entity.shadowSprite.width = entity.size * 1.5;
                entity.shadowSprite.height = entity.size / 2;
                entity.shadowSprite.anchor.setTo(0.4, -0.1);
                backEffectsGroup.add(entity.shadowSprite);
                
                entity.sprite = new Phaser.Sprite(game, entity.lastX, entity.lastY, 'character', 'ArtonHousut-Idle_0.png');
                entity.sprite.animations.add('idle', Phaser.Animation.generateFrameNames('ArtonHousut-Idle_', 0, 20, '.png'), 20, true);
                entity.sprite.animations.add('walk', Phaser.Animation.generateFrameNames('ArtonHousut-Run_', 0, 16, '.png'), 20, true);
                entity.sprite.animations.add('attack', Phaser.Animation.generateFrameNames('ArtonHousut-attack_', 0, 10, '.png'), 20, true);
                entity.sprite.animations.add('knockback', Phaser.Animation.generateFrameNames('ArtonHousut-TakesaHit_', 0, 10, '.png'), 20, true);
                console.log("asd "+entity.shadowSprite.position);
                
                entity.sprite.width = this.defaultWidth;
                entity.sprite.height = this.defaultHeight * 2;
                entity.tween = game.add.tween(entity.sprite);
                
                
                entity.sprite.anchor.setTo(0.3, 0.75);
                
                entity.sprite.animations.play('idle');
                 
                list.playerList.push(entity);
                objectGroup.add(entity.sprite);
                
                 //console.log(list.playerList[list.playerList]);
                
               
                break;

            case '1'://basic wall
                
                entity.sprite = new Phaser.Sprite(game, entity.lastX , entity.lastY, 'wall');
                entity.sprite.width = this.defaultWidth+5;
                entity.sprite.height = this.defaultHeight+35;
                entity.tween = game.add.tween(entity.sprite);
                
                entity.sprite.anchor.setTo(0.5, 0.75);
                
                objectGroup.add(entity.sprite);
             
                list.tileList.push(entity);
                
                break;

            case '2':
                break;
            case '3': //tree
                entity.sprite = new Phaser.Sprite(game, entity.lastX , entity.lastY, 'tree');
                entity.sprite.width = this.defaultWidth*5;
                entity.sprite.height = this.defaultHeight*6;
                entity.size = 10;
                entity.tween = game.add.tween(entity.sprite);
                
                entity.sprite.anchor.setTo(0.55, 0.82);
                
                objectGroup.add(entity.sprite);
             
                list.tileList.push(entity);
                break;
            case "ground":
                
                entity.sprite = new Phaser.Sprite(game, entity.x, entity.y, 'ground');
                entity.sprite.width = this.defaultWidth+20;
                entity.sprite.height = this.defaultHeight+20;
                entity.tween = game.add.tween(entity.sprite);
                
                entity.sprite.anchor.setTo(0, 0);
                groundGroup.add(entity.sprite);
               // list.tileList.push(entity); ei collisioo tälle
               
                break;
                
            case '5'://strange ball
                entity.shadowSprite = new Phaser.Sprite(game, entity.lastX, entity.lastY, 'objectShadow');
                entity.shadowSprite.anchor.setTo(0.5, -0.5);
                entity.shadowSprite.width = entity.size*1.5;
                entity.shadowSprite.height = entity.size / 2;
                
                backEffectsGroup.add(entity.shadowSprite);
                
                entity.sprite = new Phaser.Sprite(game, entity.lastX , entity.lastY, 'ball');
                entity.sprite.animations.add('idle', Phaser.Animation.generateFrameNames('Ball_01-Idle_', 0, 18, '.png'), 20, true);
                entity.sprite.animations.add('knockback_start', Phaser.Animation.generateFrameNames('Ball_01-Start_', 0, 5, '.png'), 20, true);
                entity.sprite.animations.add('knockback', Phaser.Animation.generateFrameNames('Ball_01-Middle_', 0, 2, '.png'), 20, true);
                entity.sprite.animations.add('knockback_finish', Phaser.Animation.generateFrameNames('Ball_01-Finish_', 0, 7, '.png'), 20, true);
                
                entity.sprite.width = this.defaultWidth;
                entity.sprite.height = this.defaultHeight;
                entity.sprite.scale.set(0.15,0.15);
                entity.sprite.anchor.setTo(0.5, 0.5);
                
                 entity.sprite.animations.play('idle');
                
                list.playerList.push(entity);
                objectGroup.add(entity.sprite);
                
                // override the playAnimation function from Entity class.
                entity.playAnimation = function(animationString, sprite) {
                        if(animationString == 'knockback') {
                            if(this.knockback) {
                                if( this.knockback.initialForce - this.knockback.force < 3) {
                                    this.sprite.animations.play('knockback_start');
                                } else if(this.knockback.initialForce - this.knockback.force > (this.knockback.initialForce / 4)*2) {
                                    this.sprite.animations.play('knockback_finish');
                                } else {
                                    this.sprite.animations.play('knockback');
                                }       
                            }
                        } else {
                            sprite.filters = [];
                        }
                        
                    }
                break;
            case '9': //teleportpad
                entity.sprite = new Phaser.Sprite(game, entity.lastX , entity.lastY, 'teleportPad');

               // entity.size = 10;
              //  entity.tween = game.add.tween(entity.sprite);
                
                entity.sprite.anchor.setTo(0.5, 0.5);
                entity.sprite.width = this.defaultWidth*10;
                entity.sprite.height = this.defaultHeight*10;
                
                var teleportEffect = new Phaser.Sprite(game, entity.lastX, entity.lastY-50, 'teleEffectSprite');
                teleportEffect.width = 32;
                teleportEffect.height = 32;
                teleportEffect.anchor.setTo(0.5,-0.8);
                teleportEffect.filters = [filters.teleFilter];
                
                aboveGroundGroup.add(entity.sprite);
                frontEffectsGroup.add(teleportEffect);

                break;
        }

    }
    
    this.addToBackEffects = function(effect){
        backEffectsGroup.add(effect);
    }
    
    this.addToFrontEffects = function(effect){
         frontEffectsGroup.add(effect);
    }
    
    this.addToBackGround = function(sprite) {
        backgroundGoup.add(sprite);
    }
    
    this.hitEffect = function(sprite) {
        
        // tehää tähän jotain punasena välähtelyy tms
        
    }
    this.addToObjectGroup = function(sprite) {
        objectGroup.add(sprite);
    }
    
    this.addToParticleGroup = function(emitter) {
        particleGroup.add(emitter);
    }
    
    this.destroySpriteGroups = function(){
        backEffectsGroup.removeAll(true, true);
        frontEffectsGroup.removeAll(true, true);
        aboveGroundGroup.removeAll(true, true);
        objectGroup.removeAll(true, true);
    }

}