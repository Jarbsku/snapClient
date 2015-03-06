/*global Phaser bitmap */

var ObjectList = function(game, spriteBuilder) {
    this.playerList = [];
    this.tileList = [];

    this.hero = null;
    
    this.bounds = {};

    this.push = function(entity, serverTime) {
        var found = false;

        this.playerList.forEach(function(e) {
            if (e.id == entity.id) {
                found = true;
                
                e.sprite.position.x = entity.lastX;
                e.sprite.position.y = entity.lastY;
                e.move = entity.move;
                
                e.knockback = entity.knockback;
                
                if(entity.hitDelay > 0){
                    //e.hitDelay =  entity.hitDelay - (serverTime - Date.now());
                    console.log(e.hitDelay);
                }
               // console.log("<from objectList> client: "+new Date().getTime());
               // console.log("<from objectList> server: "+serverTime);
               // console.log("<from objectList> " + entity.id + ": " + entity.move);
                
                if(this.hero){
                    if(this.hero.id == entity.id){
                        keyboardHandler.move = entity.move;
                    }
                }
            }
            
        }, this);
        
        if (!found) {

            spriteBuilder.generateSprite(entity, this);
        }
    }


    this.setHero = function(id) {
        this.playerList.forEach(function(e) {
            if (e.id == id) {
                game.camera.follow(e.sprite);
                this.hero = e;
                this.hero.isHero = true;
            }
        },this);
    }
    
    this.destroy = function(id) {
        for(var i = 0; i < this.playerList.length; i++) {
        
            if(this.playerList[i].id == id) {
                
                var obj = this.playerList.indexOf(this.playerList[i]);
                this.playerList[i].sprite.destroy();

            }
        }
        var removedPlayer = this.playerList.splice(i,1);
    }

    this.setBounds = function(width, height) {
        this.bounds.x = width;
        this.bounds.y = height;
        for(var y = 0; y < height; y++) {
            for(var x = 0; x < width-1; x++) {
                var groundTile = {
                  x: x*spriteBuilder.defaultWidth, 
                  y: y*spriteBuilder.defaultHeight, 
                  imageId: "ground", 
                  id: -1
                }
                spriteBuilder.generateSprite(groundTile, this);
            }
        }

    }

}