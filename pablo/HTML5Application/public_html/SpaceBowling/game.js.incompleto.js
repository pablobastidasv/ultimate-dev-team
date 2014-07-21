$(document).ready(function() {
	var canvas = $("#gameCanvas");
	var context = canvas.get(0).getContext("2d");
	
	// Canvas dimensions
	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();
	
	var ui= $("#gameUI");
	var uiIntro= $("#gameIntro");
	var uiStats= $("#gameStats");
	var uiComplete= $("#gameComplete");
	var uiPlay= $("#gamePlay");
	var uiReset= $(".gameReset");
	var uiRemaining= $("#gameRemaining");
	var uiScore= $(".gameScore");	
	
	// Game settings
	var playGame;
	
	// Reset and start the game
	function startGame() {
	uiScore.html("0");
	uiStats.show();
	
	// Set up initial game settings
	playGame = false;
	
	// Start the animation loop
	animate();
	};
	
	// Initialize the game environment
	function init() {
		uiStats.hide();
		uiComplete.hide();
		
		uiPlay.click(function(e){
			e.preventDefault();
			uiIntro.hide();
			startGame();
		});
		
		uiReset.click(function(e){
			e.preventDefault();
			uiCoplete.hide();
			startGame();
		});
	};
	
	// Animation loop that does all the fun stuff
	function animate() {
	// Clear
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	
	if (playGame) {
	// Run the animation loop again in 33 milliseconds
		setTimeout(animate, 33);
		};
	};
	
	init();
});