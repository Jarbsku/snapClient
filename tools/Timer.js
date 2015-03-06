var Timer = function(){

/*global: objectList */

    //variables for fixed timestep
    var timeAtLastFrame = new Date().getTime();
    var idealTimePerFrame = 1000 / 30;
    var leftover = 0.0;
    var frames = 0;


    this.tick = function(callback) {
        
        if (objectList.playerList && objectList.hero) {
            
            var timeAtThisFrame = new Date().getTime();
            var timeSinceLastDoLogic = (timeAtThisFrame - timeAtLastFrame) + leftover;
            var catchUpFrameCount = Math.floor(timeSinceLastDoLogic / idealTimePerFrame);
            
            for (var i = 0; i < catchUpFrameCount; i++) {
                callback(objectList.playerList, objectList.hero);
                
            }

            leftover = timeSinceLastDoLogic - (catchUpFrameCount * idealTimePerFrame);
            timeAtLastFrame = timeAtThisFrame;
        }
    }

}