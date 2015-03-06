
var Entity = function(msg, isPlayer){
    
    this.lastX = msg.x * spriteBuilder.spriteMultiplier;
    this.lastY = msg.y * spriteBuilder.spriteMultiplier;
    
    
    this.isPlayer = isPlayer;
    
    this.id = msg.id;
    this.imageId = msg.imageId;
    
    if(msg.force) {
        this.knockback = {
            force: msg.force,
            initialForce: msg.force,
            direction: msg.direction
        }
    } else {
        this.knockback = null;
    }
    
    this.sprite = 0;
    this.shadowSprite = 0;
    
    this.lastMove = 'r';
    
    this.direction = '';
    
    this.hitDelay = msg.delay;
    
    this.tween = null;
    
    this.size = 16;
    
    
    if(msg.speed) {
        this.speed = msg.speed * spriteBuilder.spriteMultiplier;
    } else {
        this.speed = 0;
    }
    
    if(msg.move){
        this.move = msg.move;
    }else{
        this.move = 's';
    }
    
    // please do override
    this.playAnimation = function(animationString, sprite) {
        if(isPlayer) {
            sprite.animations.play(animationString);
        }
        
    }
    
    var preventParticles = false;
    
    this.update = function() {
        
        if(this.move == 'l'&& !this.inputLocked) {
            this.playAnimation('walk', this.sprite);
            this.sprite.position.x -= this.speed;
            if(this.lastMove != this.move) {
                this.lastMove = this.move;
                this.sprite.scale.x = -this.sprite.scale.x;
                this.shadowSprite.scale.x = -this.shadowSprite.scale.x;
                //entity.sprite.anchor.setTo(0.5, 0.75);
            }
            this.direction = this.move;
        } else if(this.move == 'r'&& !this.inputLocked) {
            this.playAnimation('walk', this.sprite);
            this.sprite.position.x += this.speed;
            //flip sprite
            if(this.lastMove != this.move) {
                this.lastMove = this.move;
                this.sprite.scale.x = -this.sprite.scale.x;
                this.shadowSprite.scale.x = -this.shadowSprite.scale.x;
            }
            this.direction = this.move;
        } else if(this.move == 'u'&& !this.inputLocked) {
            this.playAnimation('walk', this.sprite);
            this.sprite.position.y -= this.speed;
            if(this.lastMove != this.move) {
                //this.lastMove = this.move;
            }
            this.direction = this.move;
        } else if(this.move == 'd'&& !this.inputLocked) {
            this.playAnimation('walk', this.sprite);
            this.sprite.position.y += this.speed;
            if(this.lastMove != this.move) {
                //this.lastMove = this.move;
            }
            this.direction = this.move;
        } else if(this.move == 's') {
            this.sprite.animations.play('idle');
        } else if(this.move == 'h'&& !this.inputLocked){
        console.log(this.hitDelay + " !!!!!");
            if(this.hitDelay < 1){
                this.hitDelay = 1;
            }
            this.inputLocked = true;
            var that = this;
            setInterval(function(){
                that.inputLocked = false;
            },that.hitDelay);
            //console.log(this.hitDelay);
            this.sprite.animations.play('attack', 20, false, false);
            if(!preventParticles) {
                preventParticles = true;
                var that = this;
                setTimeout(function(){ 
                    var distance = that.size;
                    var x = that.lastX;
                    var y = that.lastY;
                    
                    switch(that.direction) {
                    	case 'u':
                    		y -= distance;
                    		break;
                    	case 'l':
                    		x-= distance;
                    		break;
                    	case 'd':
                    		y+= distance;
                    		break;
                    	default:
                    		x+= distance;
                    		break;
                    
                    } 
                    
                    particleMachine.hit(x,y);
                 }, 400);
            }
             
           // console.log("from entity.update(): "+ 1/(this.hitDelay/1000));
        } else if(this.move == 'k') {
            this.playAnimation('knockback', this.sprite);
            
            if(this.knockback) {
                console.log("<entity.js>knockback " + this.knockback.force);
                switch(this.knockback.direction) {
                    case 'u':
                        this.sprite.position.y -= this.knockback.force;
                        break;
                    case 'd':
                        this.sprite.position.y += this.knockback.force;
                        break;
                    case 'l':
                        this.sprite.position.x -= this.knockback.force;
                        break;
                    case 'r':
                       this.sprite.position.x += this.knockback.force;
                        break;
                }
                if(this.knockback.force > 0) {
                    this.knockback.force -= 1;
                } else {
                    this.move = 's';
                }
                
                 
                
            } else {
                this.move = 's';
            }
           
        } else {
            
        }
        //console.log(this.move);
        this.lastX = this.sprite.position.x;
        this.lastY = this.sprite.position.y;
        
        
        if(this.move != 'h') {
            preventParticles = false;
        }
        
        if(this.shadowSprite){
            this.shadowSprite.position.x = this.lastX;
            this.shadowSprite.position.y = this.lastY;
        }
        
    }
    
}