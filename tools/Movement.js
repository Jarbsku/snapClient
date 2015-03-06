/*global Phaser game*/

var Movement = function(){
    
    this.move = 's';
    
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.W]);
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.S]);
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.A]);
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.D]);
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    
    //keys
	var up = game.input.keyboard.addKey(Phaser.Keyboard.W);
	var down = game.input.keyboard.addKey(Phaser.Keyboard.S);
	var left = game.input.keyboard.addKey(Phaser.Keyboard.A);
	var right = game.input.keyboard.addKey(Phaser.Keyboard.D);
	var hit = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	var cursors = game.input.keyboard.createCursorKeys();
	
	this.movementListener = function() {
			
			if (hit.isDown) {
				this.move = 'h';
			} 
			else if (up.isDown || cursors.up.isDown) {
				this.move = 'u';
			}
			else if (down.isDown || cursors.down.isDown) {
				this.move = 'd';
			}
			else if (left.isDown || cursors.left.isDown) {
				this.move = 'l';
			}
			else if (right.isDown || cursors.right.isDown) {
				this.move = 'r';
			}
			else {
				this.move = 's';
			}
		}
	
			
}