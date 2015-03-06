/*
    This has to be drafted after spritebuilder

*/

var ParticleMachine = function(game) {
    
    // inital x,y and maxium number of particles at once
    this.hitEmitter = game.add.emitter(200, 200, 100);
    this.hitEmitter.makeParticles('hitParticle');
    this.hitEmitter.gravity = 0;
    this.hitEmitter.setScale(1, 0.1, 1, 0.1, 900, Phaser.Easing.Quintic.Out);
    spriteBuilder.addToParticleGroup(this.hitEmitter);
    
    this.hit = function(x,y) {
        this.hitEmitter.x = x;
        this.hitEmitter.y = y;
        
        /* from phaser docs:
         //  The first parameter sets the effect to "explode" which means all particles are emitted at once
        //  The second gives each particle a 2000ms lifespan
        //  The third is ignored when using burst/explode mode
        //  The final parameter (10) is how many particles will be emitted in this single burst
        */
        this.hitEmitter.start(true, 200, null, 10);
        console.log(this.hitEmitter);
    }
    
    
    
}