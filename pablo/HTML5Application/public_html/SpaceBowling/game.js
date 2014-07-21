$(document).ready(function() {
	//trae el objeto con el ID que está en el index del contenedor gameCanvas
	var canvas = $("#gameCanvas"); 
	//Crea el Contexto que tiene canvas
	var context = canvas.get(0).getContext("2d"); 

	// Tamaño del Canvas 
	var canvasWidth = canvas.width(); 
	var canvasHeight = canvas.height(); 

	//Opciones del Juego
	var playGame;  
	//paso 4
	//Ubicacion de la plataforma en el canvas
	var platformX; 
	var platformY; 
	
	//Radios de la plataforma
	var platformOuterRadius;
	var platformInnerRadius;
	//fin paso 4
	
	//paso 7
	//Arreglo de los asteroides
	var asteroids;
	//fin paso 7
	
	//paso 12
	//bola del jugador
	var player; 
	
	//ubicacion de la bola del jugador
	var playerOriginalX; 
	var playerOriginalY;
	//fin paso 12
	
	//paso 18
	var playerSelected;
	var playerMaxAbsVelocity;
	var playerVelocityDampener;
	var powerX;
	var powerY;
	//fin paso 180
	
	//paso 26
	//Puntuación
	var score;
	//fin paso 26
	
//paso 1	
	//Asigna los objetos del Index con los ID's a las variables
	var ui = $("#gameUI"); 
	var uiIntro = $("#gameIntro"); 
	var uiStats = $("#gameStats"); 
	var uiComplete = $("#gameComplete"); 
	var uiPlay = $("#gamePlay"); 
	var uiReset = $(".gameReset"); 
	var uiRemaining = $("#gameRemaining"); 
	var uiScore = $(".gameScore");
	
	//paso 8
	//crea la clase Asteroid con su constructor
	var Asteroid = function(x, y, radius, mass, friction) { 
		this.x = x; 
		this.y = y; 
		this.radius = radius; 
		this.mass = mass; 
		this.friction = friction;
		this.vX = 0; 
		this.vY = 0; 
		this.player = false; 
	}
	//fin paso 8

	//paso 24
	//metodo que resetea el jugador y lo pone en el estado inicial
	function resetPlayer() {
		player.x = playerOriginalX;
		player.y = playerOriginalY;
		player.vX = 0;
		player.vY = 0;
	}
	//fin paso 24
	
	// Inicializa el juego 
	function startGame() {
	//paso 3
		// Configuraciones iniciales del juego 
		uiScore.html("0"); 
		uiStats.show();
	//fin paso 3
		playGame = false; 
		
		//paso 5 
		//calcula la posición del la plataforma y el tamaño
		platformX = canvasWidth/2; 
		platformY = 150; 
		platformOuterRadius = 100; 
		platformInnerRadius = 75;
		//fin paso 5
		
		//paso 9
		//Crea el arreglo de asteroides
		asteroids = new Array();
		//fin paso 9
		
		//paso 19
		playerSelected = false;
		//velocidad de la bola
		playerMaxAbsVelocity = 30;
		//fuerza de la bola
		playerVelocityDampener = 0.3;
		powerX = -1;
		powerY = -1;
		//fin paso 19

		//paso 27
		//Puntuación a cero
		score = 0;	
		//fin paso 27
		
		//paso 13
		//Propiedades de la bola: Radio, masa y friccion
		var pRadius = 15; 
		var pMass = 10; 
		var pFriction = 0.97; 
		//Posiociones de la bola inicial
		playerOriginalX = canvasWidth/2; 
		playerOriginalY = canvasHeight-150; 
		//Crea la bola
		player = new Asteroid(playerOriginalX, playerOriginalY, pRadius, pMass, pFriction); 
		//Asigna verdadero a la propiedad player ya que es la bola del jugador
		player.player = true; 
		//Dibuja la bola en el canvas
		asteroids.push(player);
		//fin paso 13
		
		//paso 10
		var outerRing = 8; //Asteroides alrededor de cada anillo
		var ringCount = 3; //Numero de anillos
		var ringSpacing = (platformInnerRadius/(ringCount-1)); //Distancia entre cada anillo

		for (var r = 0; r < ringCount; r++) {
			var currentRing = 0; //asterodides del anillo 
			var angle = 0; //Angulo entre cada asteroide 
			var ringRadius = 0; //Radio del anillo

			// es el anillo mas interno? 
			if (r == ringCount-1) { 
				currentRing = 1; 
			}else{ 
				currentRing = outerRing-(r*3); //calcula cuantos asteroides debe tener el anillo
				angle = 360/currentRing; //angulo entre cada anillo
				ringRadius = platformInnerRadius-(ringSpacing*r); //radio de cada anillo
			}
			
			//paso 11
			for (var a = 0; a < currentRing; a++) { //recorre el ciclo dependiendo de los asterodides de cada anillo
				var x = 0; 
				var y = 0; 
	 
				// es el anillo mas interno? 
				if (r == ringCount-1) { 
					//posicion inicial del  asteroide central ultimo anillo
					x = platformX; 
					y = platformY; 
				} else { 
					//calcula cada posicion del asteroide
					x = platformX+(ringRadius*Math.cos((angle*a)*(Math.PI/180))); 
					y = platformY+(ringRadius*Math.sin((angle*a)*(Math.PI/180))); 
				}
			 
				var radius = 10; //radio de cada asteroide
				var mass = 5; //masa de cada asteroide
				var friction = 0.95;//friccion del asteroide
				asteroids.push(new Asteroid(x, y, radius, mass, friction));  //crea el asteroide en la pantalla
			}
			//fin paso 11
		}
		
		//paso 14
		uiRemaining.html(asteroids.length-1); //asteroides que faltan al inicio
		//fin paso 14

		//paso 20
		//evento click  para tirar la bola
		$(window).mousedown(function(e) {
		//paso 21
			if (!playerSelected && player.x == playerOriginalX && player.y == playerOriginalY) {
				var canvasOffset = canvas.offset();
				var canvasX = Math.floor(e.pageX-canvasOffset.left);
				var canvasY = Math.floor(e.pageY-canvasOffset.top);
				if (!playGame) {
					playGame = true;
					animate();
				}
				var dX = player.x-canvasX;
				var dY = player.y-canvasY;
				var distance = Math.sqrt((dX*dX)+(dY*dY));
				var padding = 5;
				if (distance < player.radius+padding) {
					powerX = player.x;
					powerY = player.y;
					playerSelected = true;
				}
			}
			//fin paso 21
		});
		
		//Cuando se mueve el mouse
		$(window).mousemove(function(e) {
		//fin paso 22
			if (playerSelected) {
				var canvasOffset = canvas.offset();
				var canvasX = Math.floor(e.pageX-canvasOffset.left);
				var canvasY = Math.floor(e.pageY-canvasOffset.top);
				var dX = canvasX-player.x;
				var dY = canvasY-player.y;
				var distance = Math.sqrt((dX*dX)+(dY*dY));
				if (distance*playerVelocityDampener < playerMaxAbsVelocity) {
					powerX = canvasX;
					powerY = canvasY;
				} else {
					var ratio = playerMaxAbsVelocity/(distance*playerVelocityDampener);
					powerX = player.x+(dX*ratio);
					powerY = player.y+(dY*ratio);
				}
			}
			//fin paso 22
		});

		//Cuando se deja de presionar el boton del mouse
		$(window).mouseup(function(e) {
		//paso 23
			if (playerSelected) {
				var dX = powerX-player.x;
				var dY = powerY-player.y;
				player.vX = -(dX*playerVelocityDampener);
				player.vY = -(dY*playerVelocityDampener);
				//paso 28
				uiScore.html(++score);
				//fin paso 28
			}
			playerSelected = false;
			powerX = -1;
			powerY = -1;
			//fin paso 23
		});
		//fin paso 20 
		
		
		// Inicia el bucle de la animacion		
		animate(); 
	}//fin de startGame

	// Metodo que inicializa el juego 
	function init() {
	
	//paso 2
	uiStats.hide(); //Esconde las estadisticas
	uiComplete.hide(); //Esconde el aviso de juego completado

	//si se realiza clic en el boton Jugar
	uiPlay.click(function(e) { 
		e.preventDefault(); 
		uiIntro.hide();//Esconde la introduccion al juego 
		startGame(); //Inicia el juego
	});

	//Si se hace clic en el link reset
	uiReset.click(function(e) {
		e.preventDefault(); 
		uiComplete.hide(); //Esconde elo aviso del juego completo
		startGame(); //inicia el juego
	});
	//fin paso 2
	}

	// metodo de animacion 
	function animate() { 
		// limpia el contexto
		context.clearRect(0, 0, canvasWidth, canvasHeight); 
		//paso 6
		context.fillStyle = "rgb(100, 100, 100)"; //Define el relleno
		context.beginPath(); //inicia el patron
		context.arc(platformX, platformY, platformOuterRadius, 0, Math.PI*2, true); //dibuja la plataforma
		context.closePath(); //finaliza el patron
		context.fill();//Rellena la plataforma
		//fin paso 6
		
		//paso 24
		if (playerSelected) { 
			context.strokeStyle = "rgb(255, 255, 255)";//define el relleno
			context.lineWidth = 3;//grosor de la linea del jugador
			context.beginPath(); //inicia el patron
			context.moveTo(player.x, player.y);//mueve la linea desde donde se encuentra la bola del jugador
			context.lineTo(powerX, powerY);//mueve la linea de la direccion de disparo
			context.closePath();//finaliza el patron
			context.stroke();//dibuja
		}//fin paso 24


		context.fillStyle = "rgb(0, 255, 255)"; //define el relleno

		//paso 29
		var deadAsteroids = new Array();//define el arreglo de los asteroides que salen de la plataforma
		//fin paso 29
		
		//paso 15
		var asteroidsLength = asteroids.length; //tamaño del arreglo
		for (var i = 0; i < asteroidsLength; i++) { 
			var tmpAsteroid = asteroids[i]; 

			for (var j = i+1; j < asteroidsLength; j++) { 
				var tmpAsteroidB = asteroids[j]; 

				//paso 16
				var dX = tmpAsteroidB.x - tmpAsteroid.x;
				var dY = tmpAsteroidB.y - tmpAsteroid.y;
				var distance = Math.sqrt((dX*dX)+(dY*dY));

				if (distance < tmpAsteroid.radius + tmpAsteroidB.radius) {
					var angle = Math.atan2(dY, dX);
					var sine = Math.sin(angle);
					var cosine = Math.cos(angle);
					// Rotate asteroid position
					var x = 0;
					var y = 0;
					// Rotate asteroidB position
					var xB = dX * cosine + dY * sine;
					var yB = dY * cosine - dX * sine;
					// Rotate asteroid velocity
					var vX = tmpAsteroid.vX * cosine + tmpAsteroid.vY * sine;
					var vY = tmpAsteroid.vY * cosine - tmpAsteroid.vX * sine;
					// Rotate asteroidB velocity
					var vXb = tmpAsteroidB.vX * cosine + tmpAsteroidB.vY * sine;
					var vYb = tmpAsteroidB.vY * cosine - tmpAsteroidB.vX * sine;
					// Conserve momentum
					var vTotal = vX - vXb;
					vX = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vX + 2 * tmpAsteroidB.mass * vXb) / (tmpAsteroid.mass + tmpAsteroidB.mass);
					vXb = vTotal + vX;
					// Move asteroids apart
					xB = x + (tmpAsteroid.radius + tmpAsteroidB.radius);
					// Rotate asteroid positions back
					tmpAsteroid.x = tmpAsteroid.x + (x * cosine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * cosine + x * sine);
					tmpAsteroidB.x = tmpAsteroid.x + (xB * cosine - yB * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yB * cosine + xB * sine);
					// Rotate asteroid velocities back
					tmpAsteroid.vX = vX * cosine - vY * sine;
					tmpAsteroid.vY = vY * cosine + vX * sine;
					tmpAsteroidB.vX = vXb * cosine - vYb * sine;
					tmpAsteroidB.vY = vYb * cosine + vXb * sine;
				}	
			}//fin paso 16
		//paso 17
			// Calcula la nueva posicion
			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;
			// Friccion
			if (Math.abs(tmpAsteroid.vX) > 0.1) {
				tmpAsteroid.vX *= tmpAsteroid.friction;
			} else {
				tmpAsteroid.vX = 0;
			}
			if (Math.abs(tmpAsteroid.vY) > 0.1) {
				tmpAsteroid.vY *= tmpAsteroid.friction;
			} else {
				tmpAsteroid.vY = 0;
			}
		//fin paso 17

		//paso 30
			if (!tmpAsteroid.player) {
				var dXp = tmpAsteroid.x - platformX;
				var dYp = tmpAsteroid.y - platformY;
				var distanceP = Math.sqrt((dXp*dXp)+(dYp*dYp));
				if (distanceP > platformOuterRadius) {
					if (tmpAsteroid.radius > 0) {
						tmpAsteroid.radius -= 2;
					} else {
						deadAsteroids.push(tmpAsteroid);
					}
				}
			}
		//fin paso 30
		
		//paso 25
			if (player.x != playerOriginalX && player.y != playerOriginalY) {
				if (player.vX == 0 && player.vY == 0) {
					resetPlayer();
				} else if (player.x+player.radius < 0) {
					resetPlayer();
				} else if (player.x-player.radius > canvasWidth) {
					resetPlayer();
				} else if (player.y+player.radius < 0) {
					resetPlayer();
				} else if (player.y-player.radius > canvasHeight) {
					resetPlayer();
				}
			}
			//fin paso 25

			context.beginPath(); 
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2, true); 
			context.closePath(); 
			context.fill(); 
		}
			
					
		if (playGame) { 
		// paso 31
			var deadAsteroidsLength = deadAsteroids.length;
			if (deadAsteroidsLength > 0) {
				for (var di = 0; di < deadAsteroidsLength; di++) {
					var tmpDeadAsteroid = deadAsteroids[di];
					asteroids.splice(asteroids.indexOf(tmpDeadAsteroid), 1);
				}
			}
			//fin paso 31

			//fin paso 32
			var remaining = asteroids.length-1; // Remove player from asteroid count
			uiRemaining.html(remaining);
			if (remaining == 0) {
				// Winner!
				playGame = false;
				uiStats.hide();
				uiComplete.show();
				$(window).unbind("mousedown");
				$(window).unbind("mouseup");
				$(window).unbind("mousemove");
			}
			//fin ´paso 32
			
			// Run the animation loop again in 33 milliseconds 
			setTimeout(animate, 33); 
		}
	} 
 
	init(); 
	});
