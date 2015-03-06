/*global Phaser graphics game objectList spriteBuilder*/

var MagicEffects = function() {
    
    this.currentDayTime = 'm';
    var currentDayTimeRGB = {
      r: 0,
      g: 0,
      b: 0
        
    };
    
    var dayTimes = {
        morning:{r:100, g:100, b:70, circle:false},
        day:{r:255, g:255, b:220, circle:false},
        evening:{r:80, g:80, b:100, circle:false},
        night:{r:10, g:10, b:10, circle:true}
    };
    
    var effectsOn = false;
    
	var lightBitmap;
	var bitmap; // texture for raycasted shadows
	var shadowTexture //texture for ambient light;
	var lightSprite;
    
    this.lightsOn = function() {
        initVisibilityShadows();
        initAmbientLight();
        effectsOn = true;
        
            switch(this.currentDayTime){
                case 'm':
                    currentDayTimeRGB = dayTimes.morning;
                    break;
                case 'd':
                    currentDayTimeRGB = dayTimes.day;
                    break;
                case 'e':
                    currentDayTimeRGB = dayTimes.evening;
                    break;
                case 'n':
                    currentDayTimeRGB = dayTimes.night;
                    break;
                default:
                    
                    break;
            }
        
    }
    
    this.update = function() {
        if(effectsOn) {
            
            fogOfWar(objectList.hero);
           
            switch(this.currentDayTime){
                case 'm':
                    updateAmbientLight(dayTimes.morning);
                    break;
                case 'd':
                    updateAmbientLight(dayTimes.day);
                    break;
                case 'e':
                    updateAmbientLight(dayTimes.evening);
                    break;
                case 'n':
                    updateAmbientLight(dayTimes.night);
                    break;
                default:
                    
                    break;
            }
            
        }
    }
    
    // initializes the bitmap for raycasted shadows !private!
    var initVisibilityShadows = function() {
			// Create a bitmap texture for drawing light cones
		    bitmap = game.add.bitmapData(objectList.bounds.x*16 + 3, objectList.bounds.y*16 + 5);
		    bitmap.context.fillStyle = 'rgb(255, 255, 255)';
		    bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
		    //lightBitmap = game.add.image(0, 0, bitmap);
		    lightBitmap = new Phaser.Image(game, 0, 0, bitmap);
		    graphics =  game.add.graphics(0, 0);
			lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;
			
			spriteBuilder.addToBackEffects(lightBitmap);
			
    }
    
    
    
    this.showPlayers = function(playerList, hero) {
    // loop trough other movable characters
            playerList.forEach(function(person) {
                // entity specific update
                
                person.update();
                
                // raycasting for visible objects
                var ray = new Phaser.Line(person.sprite.position.x, person.sprite.position.y, hero.sprite.position.x, hero.sprite.position.y);
               
                var intersect = getWallIntersection(ray, person);

                if (intersect) {
                    person.sprite.visible = false;
                    person.shadowSprite.visible = false;

                }
                else {

                    person.sprite.visible = true;
                    person.shadowSprite.visible = true;
                }


            }, this);
            
    }
    
    
    var fogOfWar = function(hero) {


        bitmap.context.fillStyle = 'rgb(100, 100, 100)';
        bitmap.context.fillRect(0, 0, game.width, game.height);
   
        var stageCorners = [
            new Phaser.Point(0, 0),
            new Phaser.Point(game.width, 0),
            new Phaser.Point(game.width, game.height),
            new Phaser.Point(0, game.height)
        ];

        // Ray casting!
        // Cast rays through the corners of each wall towards the stage edge.
        // Save all of the intersection points or ray end points if there was no intersection.
        var points = [];
        var ray = null;
        var intersect;
        var i;
        
        var isInsideCamera = function(sprite) {
            if((sprite.position.x > game.camera.position.x && sprite.position.x < game.camera.position.x+game.camera.width/cameraScale.x)&&(sprite.position.y > game.camera.position.y && sprite.position.y < game.camera.position.y+game.camera.height/cameraScale.y)) {
                return true;
            }
            return false;
        };
        
        objectList.tileList.forEach(function(wall) {
            // Create a ray from the light through each corner out to the edge of the stage.
            // This array defines points just inside of each corner to make sure we hit each one.
            // It also defines points just outside of each corner so we can see to the stage edges.
            
            // dont calculate walls outside camera
            //if(isInsideCamera(wall.sprite)){
          //  console.log(wall);
          
                var corners = [
                    new Phaser.Point(wall.sprite.position.x  + 0.1 - (wall.size / 2), wall.sprite.position.y + 0.1 - (wall.size / 2)),
                    new Phaser.Point(wall.sprite.position.x  - 0.1 - (wall.size / 2), wall.sprite.position.y - 0.1 - (wall.size / 2)),
    
                    new Phaser.Point(wall.sprite.position.x - 0.1 + wall.size / 2, wall.sprite.position.y + 0.1 - (wall.size / 2)),
                    new Phaser.Point(wall.sprite.position.x + 0.1 + wall.size / 2, wall.sprite.position.y - 0.1 - (wall.size / 2)),
    
                    new Phaser.Point(wall.sprite.position.x - 0.1 + wall.size / 2, wall.sprite.position.y - 0.1 + wall.size / 2),
                    new Phaser.Point(wall.sprite.position.x + 0.1 + wall.size / 2, wall.sprite.position.y + 0.1 + wall.size / 2),
    
                    new Phaser.Point(wall.sprite.position.x + 0.1 - (wall.size / 2), wall.sprite.position.y - 0.1 + wall.size / 2),
                    new Phaser.Point(wall.sprite.position.x - 0.1 - (wall.size / 2), wall.sprite.position.y + 0.1 + wall.size / 2)
                ];
                // Calculate rays through each point to the edge of the stage
                for (i = 0; i < corners.length; i++) {
                    var c = corners[i];
    
                    // Here comes the linear algebra.
                    // The equation for a line is y = slope * x + b
                    // b is where the line crosses the left edge of the stage
                    var slope = (c.y - hero.sprite.position.y) / (c.x - hero.sprite.position.x);
                    var b = hero.sprite.position.y - slope * hero.sprite.position.x;
    
                    var end = null;
    
                    if (c.x === hero.sprite.position.x) {
                        // Vertical lines are a special case
                        if (c.y <= hero.sprite.position.y) {
                            end = new Phaser.Point(hero.sprite.position.x, 0);
                        }
                        else {
                            end = new Phaser.Point(hero.sprite.position.x, game.height);
                        }
                    }
                    else if (c.y === hero.sprite.position.y) {
                        // Horizontal lines are a special case
                        if (c.x <= hero.sprite.position.x) {
                            end = new Phaser.Point(0, hero.sprite.position.y);
                        }
                        else {
                            end = new Phaser.Point(game.width, hero.sprite.position.y);
                        }
                    }
                    else {
                        // Find the point where the line crosses the stage edge
                        var left = new Phaser.Point(0, b);
                        var right = new Phaser.Point(game.width, slope * game.width + b);
                        var top = new Phaser.Point(-b / slope, 0);
                        var bottom = new Phaser.Point((game.height - b) / slope, game.height);
    
                        // Get the actual intersection point
                        if (c.y <= hero.sprite.position.y && c.x >= hero.sprite.position.x) {
                            if (top.x >= 0 && top.x <= game.width) {
                                end = top;
                            }
                            else {
                                end = right;
                            }
                        }
                        else if (c.y <= hero.sprite.position.y && c.x <= hero.sprite.position.x) {
                            if (top.x >= 0 && top.x <= game.width) {
                                end = top;
                            }
                            else {
                                end = left;
                            }
                        }
                        else if (c.y >= hero.sprite.position.y && c.x >= hero.sprite.position.x) {
                            if (bottom.x >= 0 && bottom.x <= game.width) {
                                end = bottom;
                            }
                            else {
                                end = right;
                            }
                        }
                        else if (c.y >= hero.sprite.position.y && c.x <= hero.sprite.position.x) {
                            if (bottom.x >= 0 && bottom.x <= game.width) {
                                end = bottom;
                            }
                            else {
                                end = left;
                            }
                        }
                    }
    
                    // Create a ray
                    ray = new Phaser.Line(hero.sprite.position.x, hero.sprite.position.y, end.x, end.y);
    
                    // Check if the ray intersected the wall
                    intersect = getWallIntersection(ray);
                    if (intersect) {
                        // This is the front edge of the light blocking object
                        points.push(intersect);
                    }
                    else {
                        // Nothing blocked the ray
                        points.push(ray.end);
                    }
                }
            //}
        }, this);

        // Shoot rays at each of the stage corners to see if the corner
        // of the stage is in shadow. This needs to be done so that
        // shadows don't cut the corner.
        for (i = 0; i < stageCorners.length; i++) {
            ray = new Phaser.Line(hero.sprite.position.x, hero.sprite.position.y,
                stageCorners[i].x, stageCorners[i].y);
            intersect = getWallIntersection(ray);
            if (!intersect) {
                // Corner is in light
                points.push(stageCorners[i]);
            }
        }

        // Now sort the points clockwise around the light
        // Sorting is required so that the points are connected in the right order.
        //
        // This sorting algorithm was copied from Stack Overflow:
        // http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
        //
        // Here's a pseudo-code implementation if you want to code it yourself:
        // http://en.wikipedia.org/wiki/Graham_scan
        var center = {
            x: hero.sprite.position.x,
            y: hero.sprite.position.y
        };
        points = points.sort(function(a, b) {
            if (a.x - center.x >= 0 && b.x - center.x < 0)
                return 1;
            if (a.x - center.x < 0 && b.x - center.x >= 0)
                return -1;
            if (a.x - center.x === 0 && b.x - center.x === 0) {
                if (a.y - center.y >= 0 || b.y - center.y >= 0)
                    return 1;
                return -1;
            }

            // Compute the cross product of vectors (center -> a) x (center -> b)
            var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
            if (det < 0)
                return 1;
            if (det > 0)
                return -1;

            // Points a and b are on the same line from the center
            // Check which point is closer to the center
            var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
            var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
            return 1;
        });

        // Connect the dots and fill in the shape, which are cones of light,
        // with a bright white color. When multiplied with the background,
        // the white color will allow the full color of the background to
        // shine through.
        bitmap.context.beginPath();
        bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        bitmap.context.moveTo(points[0].x, points[0].y);
        for (var j = 0; j < points.length; j++) {
            bitmap.context.lineTo(points[j].x, points[j].y);
        }
        bitmap.context.closePath();
        bitmap.context.fill();


        // This just tells the engine it should update the texture cache
        bitmap.dirty = true; 
        

    }


    function getWallIntersection(ray, person) {

        var distanceToWall = Number.POSITIVE_INFINITY;
        var closestIntersection = null;


            // For each of the walls...
            objectList.tileList.forEach(function(wall) {
                // Create an array of lines that represent the four edges of each wall
                var lines = [
                    new Phaser.Line(wall.sprite.position.x - (wall.size / 2), wall.sprite.position.y - (wall.size / 2), wall.sprite.position.x + wall.size / 2, wall.sprite.position.y - (wall.size / 2)),
                    new Phaser.Line(wall.sprite.position.x  - (wall.size / 2), wall.sprite.position.y - (wall.size / 2), wall.sprite.position.x, wall.sprite.position.y + wall.size / 2),
                    new Phaser.Line(wall.sprite.position.x + wall.size / 2, wall.sprite.position.y - (wall.size / 2),
                        wall.sprite.position.x + wall.size / 2, wall.sprite.position.y + wall.size / 2),
                    new Phaser.Line(wall.sprite.position.x  - (wall.size / 2) , wall.sprite.position.y + wall.size / 2,
                        wall.sprite.position.x + wall.size / 2, wall.sprite.position.y + wall.size / 2)
                ];
    
                // Test each of the edges in this wall against the ray.
                // If the ray intersects any of the edges then the wall must be in the way.
                for (var i = 0; i < lines.length; i++) {
                    var intersect = Phaser.Line.intersects(ray, lines[i]);
                    if (intersect) {
                        // Find the closest intersection
                        var distance =
                            game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                        if (distance < distanceToWall) {
                            distanceToWall = distance;
                            closestIntersection = intersect;
                        }
                    }
                }
        }, this);

        


        return closestIntersection;
    }
    
    //AMBIENT LIGHT visual effect initialization and update
    
    //initializes the bitmap for nighttime shadow
    var initAmbientLight = function(){

			shadowTexture = game.add.bitmapData(game.camera.width/cameraScale.x,game.camera.height/cameraScale.y);
			
			lightSprite = new Phaser.Image(game, 0, 0, shadowTexture);

			lightSprite.fixedToCamera = true; // TÄÄ OLI FIX 1/2
			
			lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
			
			spriteBuilder.addToFrontEffects(lightSprite);
			
	}
	var phaseStep = 1;
	//update for current dayTimes shadow, with parameters r,g,b you simply darken the light and with parameter circle which is boolean you tell if player has light around him 
	var updateAmbientLight = function(dayTime){
			
		//lightSprite.reset(game.camera.x, game.camera.y); //TÄÄ OLI FIX 2/2
		
		var getCloser = function(a, b) {
		    if(a < b) {
		        a+=phaseStep;
		    } else if(a > b) {
		        a-= phaseStep;
		    }
		    return a;
		}
		//console.log(currentDayTimeRGB);
		
		currentDayTimeRGB.r=getCloser(currentDayTimeRGB.r, dayTime.r);
		currentDayTimeRGB.g=getCloser(currentDayTimeRGB.g, dayTime.g);
		currentDayTimeRGB.b=getCloser(currentDayTimeRGB.b, dayTime.b);
		
        var shadowColor = 'rgb('+currentDayTimeRGB.r+','+currentDayTimeRGB.g+','+currentDayTimeRGB.b+')';
	
		shadowTexture.context.fillStyle = shadowColor;
		
		var radius = 50,// + game.rnd.integerInRange(1,10),
			heroX = game.camera.width/cameraScale.x/2,
			heroY = game.camera.width/cameraScale.y/2-45; // TODO muuta taikaluku
			
		shadowTexture.context.fillRect(0, 0, game.camera.width, game.camera.height);
		
		if(dayTime.circle){
		    
		var gradient = shadowTexture.context.createRadialGradient(heroX, heroY, 50 * 0.75, heroX, heroY, radius);
		
		gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
		gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
		
		 shadowTexture.context.beginPath();
		 shadowTexture.context.fillStyle = gradient;
		 shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI*2, false);
		 shadowTexture.context.fill();
		 
		 // This just tells the engine it should update the texture cache
		 shadowTexture.dirty = true;
		 
		}
		shadowTexture.dirty = true;
			
	}
    
}