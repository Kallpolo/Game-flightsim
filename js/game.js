////////////////////////////////////////////////////////////
// GAME v1.8
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

var scorePoint = 100; //score point per plane
var landedTextDisplay = 'LANDED: [NUMBER]/[TOTAL]'; //landed display text
var scoreTextDisplay = '[NUMBER]PTS'; //score display text

var drawStrokeStyle = 4; //drawing stroke number
var drawStrokeColor = '#fff'; //drawing stroke color
var drawStrokeAlpha = 1;  //drawing stroke alpha
var strokeStyle = 2;  //default stroke number
var strokeColor = '#fff'; //default stroke color
var strokeAlpha = .5; //default stroke alpha
var lostStrokeStyle = 2;  //default stroke number
var lostStrokeColor = '#666'; //default stroke color
var lostStrokeAlpha = .5; //default stroke alpha

var autoLandPath = true; //enable to draw auto path for landing zone;

//airplane array list
var airplane_arr = [{src:'assets/item_plane1.png', width:71, height:71, radius:35, speed:1},
					{src:'assets/item_plane2.png', width:55, height:64, radius:27, speed:1.2},
					{src:'assets/item_helicopter1.png', width:57, height:54, radius:30, speed:1.5},
					{src:'assets/item_plane3.png', width:71, height:72, radius:35, speed:1},
					{src:'assets/item_plane4.png', width:60, height:46, radius:27, speed:.8},
					{src:'assets/item_helicopter2.png', width:90, height:54, radius:35, speed:1.5},
					{src:'assets/item_plane5.png', width:99, height:47, radius:50, speed:1.8},
					{src:'assets/item_plane6.png', width:54, height:64, radius:25, speed:1.2},];

var selectTitleText = 'Levels'; //select level page title	
var levelCompletedText = 'Level Complete'; //level complete display text		
var exitMessage = 'Are you sure\nyou want to quit?'; //go to main page message

var resultCompleteText = 'Level [NUMBER] Complete'; //result complete text display
var resultFailText = 'Game Over';  //result fail text display
var resultScoreText = '[NUMBER]PTS';  //result score text display

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareText = 'SHARE YOUR SCORE'; //social share message
var shareTitle = 'Highscore on Flight Sim Game at Level[LEVEL] is [SCORE]PTS.';//social share score title
var shareMessage = 'Level[LEVEL] - [SCORE]PTS is mine new highscore on Flight Sim Game! Try it now!'; //social share score message
				
/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
var playerData = {score:0, displayScore:0, total:0};
var gameData = {levelNum:0, speed:0, alertTimer:3, nextPlaneTimer:6, countPlane:0, totalPlane:0, oldX:0, oldY:0, lastX:0, lastY:0, stageX:0, stageY:0, dotDistance:10, dotted:true, planes:[], runway:[], types:[], typeCount:0, targetPlane:null, paused:true, stageLevelCompleted:0, stageComplete:false, tutorial:true};

$.editor = {enable:false, runwayNum:0};

var collisionMethod = ndgmr.checkRectCollision;
var cookieName = 'FlightSim2017';

/*!
 * 
 * DATA UPDATE - This is the function that runs to update data
 * 
 */
function retrieveLevelData(){
	var curStage = Cookies.get(cookieName);
	if(curStage != undefined){
		gameData.stageLevelCompleted = Number(curStage);
	}
}

function saveLevelData(){
	if(Number(gameData.levelNum)+1 > gameData.stageLevelCompleted){
		gameData.stageLevelCompleted = Number(gameData.levelNum)+1;
		Cookies.set(cookieName, gameData.stageLevelCompleted, {expires:360});
		selectPage(selectData.page);
	}
}

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('select');
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('select');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		if(!$.editor.enable){
			toggleConfirm(true);
		}
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		toggleConfirm(false);
		stopGame(true);
		goPage('main');
		toggleOption();
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		toggleConfirm(false);
	});
	
	buttonTutContinue.cursor = "pointer";
	buttonTutContinue.addEventListener("click", function(evt) {
		toggleTutorial(false);
	});
}

/*!
 * 
 * SELECT LEVEL - This is the function that runs to display select levels
 * 
 */
var selectData = {page:0, total:1, max:10};
function buildSelectLevel(){
	selectData.total = levels_arr.length/selectData.max;
	
	if (String(selectData.total).indexOf('.') > -1){
		selectData.total=Math.floor(selectData.total)+1;
	}
	toggleSelect(false);
	
	buttonArrowL.cursor = "pointer";
	buttonArrowL.addEventListener("mousedown", function(evt) {
		playSound('soundSelect');
		toggleSelect(false);
	});
	
	buttonArrowR.cursor = "pointer";
	buttonArrowR.addEventListener("mousedown", function(evt) {
		playSound('soundSelect');
		toggleSelect(true);
	});
	
	for(var n=0;n<levels_arr.length;n++){
		$.selectStage['icon_'+n].name = n;
		$.selectStage['icon_'+n].cursor = "pointer";
		$.selectStage['icon_'+n].addEventListener("mousedown", function(evt) {
			if(Number(evt.target.name) <= gameData.stageLevelCompleted){
				playSound('soundClick');
				gameData.levelNum = Number(evt.target.name);
				goPage('game');
			}
		});
	}
}

function toggleSelect(con){
	if(con){
		selectData.page++;
		selectData.page = selectData.page > selectData.total ? selectData.total : selectData.page;
	}else{
		selectData.page--;
		selectData.page = selectData.page < 1 ? 1 : selectData.page;
	}
	selectPage(selectData.page);
}

function selectPage(num){
	selectData.page = num;
	
	var startNum = (selectData.page-1) * selectData.max;
	var endNum = startNum + (selectData.max-1);
	
	for(var n=0;n<levels_arr.length;n++){
		if(n >= startNum && n <= endNum){
			$.selectStage['icon_'+n].visible = true;
			$.selectStage['iconLock_'+n].visible = true;
			$.selectStage['iconText_'+n].visible = true;
			if(n <= gameData.stageLevelCompleted){
				$.selectStage['iconLock_'+n].visible = false;
			}
		}else{
			$.selectStage['iconLock_'+n].visible = false;
			$.selectStage['icon_'+n].visible = false;
			$.selectStage['iconText_'+n].visible = false;	
		}
	}
	
	if(selectData.page == 1){
		buttonArrowL.visible = false;	
	}else{
		buttonArrowL.visible = true;	
	}
	
	if(selectData.page == selectData.total || selectData.total == 1){
		buttonArrowR.visible = false;	
	}else{
		buttonArrowR.visible = true;	
	}
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	selectContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	stopSoundLoop('musicMain');
	stopSoundLoop('musicGame');
	TweenMax.killTweensOf(playerData);
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			playSoundLoop('musicMain');
		break;
		
		case 'select':
			targetContainer = selectContainer;
			playSoundLoop('musicMain');
		break;
		
		case 'game':
			targetContainer = gameContainer;
			if(!$.editor.enable){
				playSoundLoop('musicGame');
				startGame();
			}
		break;
		
		case 'result':
			targetContainer = resultContainer;
			playSound('soundNotification');
			playSoundLoop('musicMain');
			
			stopGame(true);
			if(gameData.stageComplete){
				resultTitleTxt.text = resultCompleteText.replace('[NUMBER]', gameData.levelNum+1);
				saveLevelData();
			}else{
				resultTitleTxt.text = resultFailText;	
			}
			TweenMax.to(playerData, 1, {displayScore:playerData.score, overwrite:true, onUpdate:function(){
				resultScoreTxt.text = resultScoreText.replace('[NUMBER]', addCommas(Math.floor(playerData.displayScore)));	
			}});
			
			saveGame(playerData.score, gameData.levelNum);
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

function toggleConfirm(con){
	confirmContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true)
		gameData.paused = false;
	}
}

function toggleTutorial(con){
	if(con){
		tutorialContainer.alpha = 0;
		TweenMax.to(tutorialContainer, .5, {alpha:1, overwrite:true});
	}else{
		TweenMax.to(tutorialContainer, .5, {alpha:0, overwrite:true, onComplete:function(){
			tutorialContainer.visible = false;
		}});
		
		startPlaneTimer(0);
		gameData.paused = false;
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */

function startGame(){
	if(!$.editor.enable){
		for(n=0;n<levels_arr.length;n++){
			$.stage[n].visible = false;
		}
		$.stage[gameData.levelNum].visible = true;
	}
	
	gameData.planes = [];
	gameData.runway = [];
	gameData.types = [];
	gameData.typeCount = 0;
	gameData.countPlane = 0;
	gameData.totalPlane = levels_arr[gameData.levelNum].level.total;
	gameData.speed = levels_arr[gameData.levelNum].level.speed;
	gameData.nextPlaneTimer = levels_arr[gameData.levelNum].level.planTimer;
	gameData.stageComplete = false;
	
	playerData.score = playerData.displayScore = 0;
	playerData.total = 0;
	updateStatus();
	
	for(var n=0;n<levels_arr[gameData.levelNum].runway.length;n++){
		createRunway(false, levels_arr[gameData.levelNum].runway[n].type, levels_arr[gameData.levelNum].runway[n].x, levels_arr[gameData.levelNum].runway[n].y, levels_arr[gameData.levelNum].runway[n].rotation);
		
		for(var t=0;t<levels_arr[gameData.levelNum].runway[n].planes.length;t++){
			gameData.types.push(levels_arr[gameData.levelNum].runway[n].planes[t]);		
		}
	}
	
	gameData.types = unique(gameData.types);
	shuffle(gameData.types);
	
	TweenMax.ticker.useRAF(false);
	TweenMax.lagSmoothing(0);

	itemBoom.visible = false;
	completeContainer.visible = false;
	
	if(gameData.tutorial){
		gameData.tutorial = false;
		toggleTutorial(true);
	}else{
		startPlaneTimer(0);
		gameData.paused = false;
	}
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gameData.paused = true;
	TweenMax.killAll();
	
	runwayContainer.removeAllChildren();
	linesContainer.removeAllChildren();
	planeContainer.removeAllChildren();
	collisionContainer.removeAllChildren();
}

/*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
function saveGame(score, type){
	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * LOOP UPDATE GAME - This is the function that runs to update game loop
 * 
 */
function updateGame(){
	if(!gameData.paused){
		loopAirplane();
		removeObjects();
	}
}

/*!
 * 
 * LOOP AIRPLANE - This is the function that run to loop airplane
 * 
 */
function loopAirplane(){
	//disable collision alert
	var nowDate = new Date();
	for(var n=0;n<gameData.planes.length;n++){
		var curAirplane = gameData.planes[n];	
		if(curAirplane.active){
			curAirplane.collisionOuter.visible = false;
			curAirplane.collisionInner.visible = false;
			
			if(curAirplane.bonusTimer < 60000){
				curAirplane.bonusTimer = nowDate.getTime() - curAirplane.bonusStartTimer.getTime();
			}
		}
	}
	
	for(var n=0;n<gameData.planes.length;n++){
		var curAirplane = gameData.planes[n];
		if(curAirplane.active){
			var curRadius = curAirplane.radius;
			if(curAirplane.path.length > 0 && !curAirplane.pathed){
				animatePlanePath(curAirplane);
			}
			
			if(curAirplane.pathed){
				curRadius = 0;	
			}
			
			if(curAirplane.timer <= 0){
				var resetPlane = false;
				if(curAirplane.x < offset.x + curRadius){
					resetPlane = true;
				}else if(curAirplane.x > (canvasW - offset.x)-curRadius){
					resetPlane = true;
				}
				
				if(curAirplane.y < offset.y+curRadius){
					resetPlane = true;
				}else if(curAirplane.y > (canvasH - offset.y)-curRadius){
					resetPlane = true;
				}
				
				if(resetPlane){
					animatePlaneRandomPos(curAirplane, false, 'center');
				}
			}else{
				curAirplane.timer--;	
			}
			
			if(curAirplane.stuckTimer > 0){
				curAirplane.stuckTimer--;
			}else{
				curAirplane.stuckTimer = 50;
				
				if(curAirplane.oldX == curAirplane.x && curAirplane.oldY == curAirplane.y){
					curAirplane.stuckTimer = 100;
					TweenMax.killTweensOf(curAirplane);
					
					if(curAirplane.pathed && curAirplane.path.length > 0){
						//reset
						curAirplane.runwayGuidePlane = 0;
						curAirplane.scaleNum = 1;
						curAirplane.pathed = false;
						curAirplane.landed = false;
						curAirplane.completed = false;
						updatePlaneStroke(curAirplane);
						animatePlanePath(curAirplane);
						
						/*curAirplane.path = [];
						curAirplane.pathed = false;
						curAirplane.completed = false;
						curAirplane.landed = false;
						curAirplane.scaleNum = 1;
						curAirplane.scaleX = curAirplane.scaleY = 1;
						updatePlaneStroke(curAirplane);*/
					}else{
						animatePlaneRandomPos(curAirplane, true);
					}
				}
				
				curAirplane.oldX = curAirplane.x;
				curAirplane.oldY = curAirplane.y;
			}
			
			//collision
			var collisionAlert = false;
			for(var p=0;p<gameData.planes.length;p++){
				var nextAirplane = gameData.planes[p];
				if(n != p && nextAirplane.active){
					var distance = getDistance(curAirplane, nextAirplane);
					var minRadius = curAirplane.radius <= nextAirplane.radius ? curAirplane.radius : nextAirplane.radius;
					
					if(curAirplane.scaleX == nextAirplane.scaleX){
						if(distance < Number(minRadius)+130){
							collisionAlert = true;
							if(!curAirplane.isAlert){
								curAirplane.isAlert = true;
								playSound('soundCollision');
							}
							
							curAirplane.collisionOuter.visible = true;
							curAirplane.collisionInner.visible = true;
							curAirplane.collisionOuter.x = curAirplane.x;
							curAirplane.collisionOuter.y = curAirplane.y;
							curAirplane.collisionInner.x = curAirplane.x;
							curAirplane.collisionInner.y = curAirplane.y;
							curAirplane.collisionInner.rotation++;
							
							if(!nextAirplane.isAlert){
								nextAirplane.isAlert = true;
							}
							
							nextAirplane.collisionOuter.visible = true;
							nextAirplane.collisionInner.visible = true;
							nextAirplane.collisionOuter.x = nextAirplane.x;
							nextAirplane.collisionOuter.y = nextAirplane.y;
							nextAirplane.collisionInner.x = nextAirplane.x;
							nextAirplane.collisionInner.y = nextAirplane.y;
							nextAirplane.collisionInner.rotation++;
						}
						
						if(distance < Number(minRadius)*2){
							var position = getCenterPosition(curAirplane.x, curAirplane.y, nextAirplane.x, nextAirplane.y);
							itemBoom.visible = true;
							itemBoom.x = position.x;
							itemBoom.y = position.y;
							itemBoom.rotation = randomIntFromInterval(-45,45);
							endGame();
						}
					}
				}
			}
			
			if(!collisionAlert && curAirplane.isAlert){
				curAirplane.isAlert = false;	
			}
		}
	}
}

function endGame(){
	if(!$.editor.enable){
		gameData.paused = true;
		TweenMax.killAll();
		
		if(gameData.stageComplete){
			playSound('soundComplete');
			completeContainer.visible = true;
			completeContainer.rotation = randomIntFromInterval(-45,45);
			completeContainer.alpha = 0;
			completeContainer.scaleX = completeContainer.scaleY = 1.5;
			TweenMax.to(completeContainer, .2, {delay:.5, alpha:1, rotation:0, scaleX:1, scaleY:1, overwrite:true});	
		}else{
			playSound('soundBoom');
			playSound('soundFail');	
		}
		TweenMax.to(gameData, 2, {overwrite:true, onComplete:function(){
			goPage('result');	
		}});
	}else{
		if(gameData.stageComplete){
			toggleGameStatus('Game Completed.');
		}else{
			toggleGameStatus('Game Over.');	
		}
		stopGame();
	}	
}

/*!
 * 
 * REMOVE OBJECTS - This is the function that run to remove objects
 * 
 */
function removeObjects(){
	for(var n=0; n<gameData.planes.length;n++){
		var curAirplane = gameData.planes[n];
		if(curAirplane.destroy){
			gameData.planes.splice(n,1);
			n = gameData.planes.length;
		}
	}	
}

/*!
 * 
 * PLANE TIMER - This is the function that run to set timer for new plane
 * 
 */
function startPlaneTimer(delay){
	var delayNum = delay == undefined ? gameData.nextPlaneTimer : delay;
	TweenMax.to(gameData, delayNum, {overwrite:true, onComplete:checkCreatePlane});
}

function checkCreatePlane(){
	createPlane(gameData.types[gameData.typeCount]);
	gameData.typeCount++;
	if(gameData.typeCount >= gameData.types.length){
		gameData.typeCount = 0;
		shuffle(gameData.types);	
	}
	
	if(gameData.countPlane < gameData.totalPlane){
		startPlaneTimer();	
	}
}

/*!
 * 
 * CREATE PLANE - This is the function that run to create new plane
 * 
 */
function createPlane(type){
	gameData.countPlane++;
	
	var newAirplane = $.airplane[type].clone();
	newAirplane.radius = airplane_arr[type].radius;
	newAirplane.speed = airplane_arr[type].speed;
	newAirplane.scaleNum = 1;
	newAirplane.path = [];
	newAirplane.active = false;
	newAirplane.destroy = false;
	newAirplane.pathed = false;
	newAirplane.landed = false;
	newAirplane.completed = false;
	newAirplane.planeType = type;
	newAirplane.timer = 0;
	newAirplane.alpha = 0;
	newAirplane.bonusStartTimer = new Date();
	newAirplane.bonusTimer = 0;
	newAirplane.collisionSound = false;
	newAirplane.isAlert = false;
	newAirplane.countPlane = gameData.countPlane;
	
	var newAlert = itemAlert.clone();
	newAirplane.alert = newAlert;
	
	var position = getRandomPosition(newAirplane.radius);
	newAirplane.x = position.x;
	newAirplane.y = position.y;
	newAirplane.oldX = position.x;
	newAirplane.oldY = position.y;
	newAirplane.stuckTimer = 100;
	
	var alertPosition = getAlertPos(position.x, position.y);
	newAirplane.alert.x = alertPosition.x;
	newAirplane.alert.y = alertPosition.y;
	
	var drawingStroke = new createjs.Shape();
	newAirplane.drawingStroke = drawingStroke;
	linesContainer.addChild(drawingStroke);
	
	gameData.planes.push(newAirplane);
	planeContainer.addChild(newAirplane, newAlert);
	
	var collisionOuter = itemCollisionOuter.clone();
	var collisionInner = itemCollisionInner.clone();
	newAirplane.collisionOuter = collisionOuter;
	newAirplane.collisionInner = collisionInner;
	collisionInner.visible = collisionOuter.visible = false;
	collisionContainer.addChild(collisionOuter, collisionInner);
	
	newAirplane.cursor = "pointer";
	newAirplane.addEventListener("mousedown", function(evt) {
		if(gameData.targetPlane == null && !evt.target.landed && !gameData.paused){
			playSound('soundSelect');
			gameData.targetPlane = evt.target;
			createPlanePath();
		}
	});	
	
	//delay
	TweenMax.to(newAirplane, 0, {delay:gameData.alertTimer, overwrite:true, onComplete:movePlane, onCompleteParams:[newAirplane]});
}

function movePlane(plane){
	plane.active = true;
	plane.alpha = 1;
	plane.startTimer = new Date();
	
	planeContainer.removeChild(plane.alert);
	animatePlaneRandomPos(plane, false, 'center');
}

function getRandomPosition(radius, to){
	var position = {x:0, y:0};
	var randomTopSide = randomBoolean();
	var randomSide = randomBoolean();
	
	if(to == undefined){
		radius = -(radius);	
	}
	
	if(randomTopSide){
		//left right
		position.y = randomIntFromInterval(offset.y+radius, (canvasH-offset.y)-radius);
		if(randomSide){
			position.x = offset.x+radius;
		}else{
			position.x = (canvasW-offset.x)-radius;	
		}
	}else{
		//top bottom
		position.x = randomIntFromInterval(offset.x+radius, (canvasW-offset.x)-radius);
		if(randomSide){
			position.y = offset.y + radius;
		}else{
			position.y = (canvasH-offset.y)-radius;	
		}	
	}
	
	if(to == 'center'){
		position.x = randomIntFromInterval(canvasW/100 * 30, canvasW/100 * 70);
		position.y = randomIntFromInterval(canvasH/100 * 30, canvasH/100 * 70);
	}
	
	return position;
}

function getAlertPos(x, y){
	var position = {x:x, y:y};
	var radius = 40;
	
	if(x <= offset.x +radius){
		position.x = offset.x +radius;	
	}else if(x >= (canvasW-offset.x)-radius){
		position.x = (canvasW-offset.x)-radius;	
	}
	
	if(y <= offset.y +radius){
		position.y = offset.y+radius+50;	
	}else if(y >= (canvasH-offset.y)-radius){
		position.y = (canvasH-offset.y)-radius;	
	}
	
	return position;
}

function getAnglePosition(x1, y1, radius, angle){
	var position = {x:0, y:0};
    position.x = x1 + radius * Math.cos(angle * Math.PI/180);
    position.y = y1 + radius * Math.sin(angle * Math.PI/180);
	return position;
}

/*!
 * 
 * REMOVE PLANE - This is the function that run to remove plane
 * 
 */
function removePlane(targetAirplane){
	targetAirplane.active = false;
	targetAirplane.destroy = true;
	TweenMax.killTweensOf(targetAirplane);
	targetAirplane.collisionOuter.visible = false;
	targetAirplane.collisionInner.visible = false;
			
	linesContainer.removeChild(targetAirplane.drawingStroke);
	planeContainer.removeChild(targetAirplane);
	collisionContainer.addChild(targetAirplane.collisionOuter, targetAirplane.collisionInner);
}

/*!
 * 
 * ANIMATE PLANE RANDOM POSITION - This is the function that run to animate random position
 * 
 */
function animatePlaneRandomPos(plane, con, to){
	plane.path = [];
	plane.runwayNum = -1;
	plane.runwayGuide = -1;
	plane.runwayGuidePlane = -1;
	plane.runwayType = -1;
	plane.pathed = false;
	plane.timer = 200;
	
	updatePlaneStroke(plane);
	
	var position;
	var continueTween = false;
	if(!con){
		position = getRandomPosition(plane.radius, to);
		if(to == 'center'){
			continueTween = true;	
		}
	}else{
		position = getAnglePosition(plane.x, plane.y, canvasW, plane.rotation);	
	}
	var newX = position.x;
	var newY = position.y;
	
	var distance = getDistanceByValue(plane.x, plane.y, newX, newY);
	var speedTween = (plane.speed-gameData.speed) * (distance * 0.02);
	var newRotate = getDirectionByValue(plane.x, plane.y, newX, newY);
	
	var pathArray = [];
	pathArray.push({x:plane.x, y:plane.y});
	pathArray.push({x:newX, y:newY});
	
	TweenMax.to(plane, speedTween, {bezier:{type:"thru", values:pathArray, curviness:0, autoRotate:true}, overwrite:true, ease:Linear.easeNone, onComplete:animatePlaneRandomPos, onCompleteParams:[plane, continueTween]});
}

/*!
 * 
 * CREATE RUNWAY - This is the function that create new runway
 * 
 */
function createRunway(con, type, x, y, rotation, n){
	var newRunwayContainer = new createjs.Container();
	newRunwayContainer.x = x;
	newRunwayContainer.y = y;
	newRunwayContainer.rotation = rotation;
	newRunwayContainer.runwayType = type;
	
	if(type == 0){
		var landingGuide = itemRunwayGuide.clone();
		var landingGuideStart = itemRunwayHit.clone();
		var landingGuideMiddle = itemRunwayHit.clone();
		var landingGuideAlpha = itemRunwayHit.clone();
		var landingGuideEnd = itemRunwayHit.clone();
		var landingGuideAnimate = itemRunwayAnimate.clone();
		landingGuide.x = 0;
		
		landingGuideStart.x = 10;
		landingGuideMiddle.x = 50;
		landingGuideAlpha.x = 90;
		landingGuideEnd.x = 130;
		landingGuideAnimate.x = 30;
		newRunwayContainer.addChild(landingGuide, landingGuideAnimate, landingGuideStart, landingGuideMiddle, landingGuideAlpha, landingGuideEnd);
	}else{
		var landingGuide = itemHelipadGuide.clone();
		var landingGuideStart = itemHelipadHit.clone();
		var landingGuideAnimate = itemHelipadAnimate.clone();
		landingGuideAnimate.x = 0;
		landingGuideStart.x = 0;
		landingGuide.x = 0;
		newRunwayContainer.addChild(landingGuide, landingGuideAnimate, landingGuideStart);		
	}
	
	if(!con){
		if(type == 0){
			landingGuide.alpha = 0;
			landingGuideStart.alpha = 0;
			landingGuideMiddle.alpha = 0;
			landingGuideAlpha.alpha = 0;
			landingGuideEnd.alpha = 0;
			landingGuideAnimate.alpha = 0;
			gameData.runway.push({container:newRunwayContainer, guideStart:landingGuideStart, guideMiddle:landingGuideMiddle, guideAlpha:landingGuideAlpha, guideEnd:landingGuideEnd, guideAnimate:landingGuideAnimate});
		}else{
			landingGuide.alpha = 0;
			landingGuideStart.alpha = 0;
			landingGuideAnimate.alpha = 0;
			gameData.runway.push({container:newRunwayContainer, guideStart:landingGuideStart, guideMiddle:null, guideAlpha:null, guideEnd:null, guideAnimate:landingGuideAnimate});	
		}
		runwayContainer.addChild(newRunwayContainer);
	}else{
		$.editObj[n] = newRunwayContainer;
		editRunwayContainer.addChild(newRunwayContainer);
		buildDragAndDrop(newRunwayContainer);	
	}
}

 /*!
 * 
 * SETUP TOUCH EVENTS - This is the function that runs to setup touch events
 * 
 */
function setupTouchEvents(){
	//events
	stage.on("stagemousedown", function(evt) {
		gameData.stageX = evt.stageX
		gameData.stageY = evt.stageY;
		gameData.oldX = gameData.stageX;
		gameData.oldY = gameData.stageY;
		gameData.lastX = gameData.stageX;
		gameData.lastY = gameData.stageY;
		gameData.dotX = gameData.stageX;
		gameData.dotY = gameData.stageY;
	});
	
	stage.on("stagemousemove", function(evt) {
		if(gameData.targetPlane != null){
			gameData.stageX = evt.stageX;
			gameData.stageY = evt.stageY;
			itemSquare.x = gameData.stageX;
			itemSquare.y = gameData.stageY;
			
			moveAirplanePath();
			
			for(var n=0;n<gameData.runway.length;n++){
				var runwayType = gameData.runway[n].container.runwayType;
				if(levels_arr[gameData.levelNum].runway[n].planes.indexOf(gameData.targetPlane.planeType) != -1){
					if(runwayType == 0){
						var guideStart = gameData.runway[n].guideStart;
						var guideMiddle = gameData.runway[n].guideMiddle;
						var guideAlpha = gameData.runway[n].guideAlpha;
						var guideEnd = gameData.runway[n].guideEnd;
						
						var intersection1 = collisionMethod(guideStart, itemSquare);
						var intersection2 = collisionMethod(guideMiddle, itemSquare);
						var intersection3 = collisionMethod(guideAlpha, itemSquare);
						var intersection4 = collisionMethod(guideEnd, itemSquare);
						
						if(intersection1){
							if(gameData.targetPlane.runwayNum != n){
								gameData.targetPlane.runwayType = runwayType;
								gameData.targetPlane.runwayNum = n;
								gameData.targetPlane.runwayGuide = -1;
								gameData.targetPlane.runwayGuidePlane = -1;
							}
							gameData.targetPlane.runwayGuide = 0;
						}else if(intersection2 && gameData.targetPlane.runwayNum == n && gameData.targetPlane.runwayGuide == 0){
							gameData.targetPlane.runwayGuide = 1;	
						}else if(intersection3 && gameData.targetPlane.runwayNum == n && gameData.targetPlane.runwayGuide == 1){
							gameData.targetPlane.runwayGuide = 2;
						}else if(intersection4 && gameData.targetPlane.runwayNum == n && gameData.targetPlane.runwayGuide == 2){
							gameData.targetPlane.runwayGuide = 3;
						}
					}else{
						var guideStart = gameData.runway[n].guideStart;
						var intersection1 = collisionMethod(guideStart, itemSquare);
						
						if(intersection1){
							gameData.targetPlane.runwayType = runwayType;
							gameData.targetPlane.runwayNum = n;
							gameData.targetPlane.runwayGuide = 3;
						}	
					}
				}
			}
		}
	});
	
	stage.on("stagemouseup", function(evt) {
		if(gameData.targetPlane != null){
			autoDrawLandPath();
			gameData.targetPlane = null;
			for(var n=0;n<gameData.runway.length;n++){
				var guideAnimate = gameData.runway[n].guideAnimate;
				guideAnimate.alpha = 0;
			}
		}
	});
}

function autoDrawLandPath(){
	if(!autoLandPath){
		return;	
	}
	
	if(gameData.targetPlane.runwayGuide >=0){
		var runwayType = gameData.runway[gameData.targetPlane.runwayNum].container.runwayType;
		if(gameData.targetPlane.runwayGuide != 3 && runwayType == 0){
			var container = gameData.runway[gameData.targetPlane.runwayNum].container;
			
			var totalPath = 15;
			var totalAngleNum = 10;
			var angleNum = 50;
			//50,90,130
			
			if(gameData.targetPlane.runwayGuide == 1){
				totalPath = 12;
				angleNum = 90;
			}else if(gameData.targetPlane.runwayGuide == 2){
				totalPath = 10;
				angleNum = 130;	
			}
			
			gameData.targetPlane.runwayGuide = 3;
			for(var p=0; p<totalPath; p++){
				var position = getAnglePosition(container.x, container.y, angleNum, container.rotation);	
				gameData.targetPlane.path.push({x:position.x, y:position.y, dotted:false});
				angleNum+=totalAngleNum;
			}
		}
	}
}

/*!
 * 
 * CREATE PLANE PATH - This is the function that create plane path
 * 
 */
function createPlanePath(){
	TweenMax.killTweensOf(gameData.targetPlane);
	
	gameData.targetPlane.path = [];
	gameData.targetPlane.runwayNum = -1;
	gameData.targetPlane.runwayGuide = -1;
	gameData.targetPlane.runwayGuidePlane = -1;
	gameData.targetPlane.runwayType = -1;
	gameData.targetPlane.pathed = false;
	gameData.targetPlane.dotted = true;
	updatePlaneStroke(gameData.targetPlane);
	
	var drawingStroke = gameData.targetPlane.drawingStroke;
	drawingStroke.alpha = drawStrokeAlpha;
	drawingStroke.graphics.beginStroke(drawStrokeColor)
					  .setStrokeStyle(drawStrokeStyle)
					  .moveTo(stage.mouseX, stage.mouseY);
					  
	for(var n=0;n<gameData.runway.length;n++){
		if(levels_arr[gameData.levelNum].runway[n].planes.indexOf(gameData.targetPlane.planeType) != -1){
			var guideAnimate = gameData.runway[n].guideAnimate;
			guideAnimate.alpha = 1;
		}
	}
}

/*!
 * 
 * MOVE PLANE PATH - This is the function that move plane path
 * 
 */
function moveAirplanePath(){
	var distanceDot = getDistanceByValue(gameData.dotX, gameData.dotY, gameData.stageX, gameData.stageY);
	if(distanceDot > gameData.dotDistance){
		gameData.dotX = gameData.stageX;
		gameData.dotY = gameData.stageY;
		gameData.dotted = gameData.dotted == true ? false : true;
	}
	
	var distance = getDistanceByValue(gameData.lastX, gameData.lastY, gameData.stageX, gameData.stageY);
	if(distance > 10){
		gameData.lastX = gameData.stageX;
		gameData.lastY = gameData.stageY;
		gameData.targetPlane.path.push({x:gameData.stageX, y:gameData.stageY, dotted:gameData.dotted});
	}
	
	var drawingStroke = gameData.targetPlane.drawingStroke;
	if(gameData.dotted){
		var drawingStroke = gameData.targetPlane.drawingStroke;
		drawingStroke.graphics.beginStroke(drawStrokeColor)
						  .setStrokeStyle(drawStrokeStyle)
						  .moveTo(gameData.oldX, gameData.oldY)
						  .lineTo(gameData.stageX, gameData.stageY);
	}else{
		gameData.oldX = gameData.stageX;
		gameData.oldY = gameData.stageY
	}
}


/*!
 * 
 * ANIMATE PLANE PATH - This is the function that animate plane path
 * 
 */
function animatePlanePath(targetAirplane){
	if(targetAirplane.path.length > 0 && !targetAirplane.pathed){
		targetAirplane.pathed = true;
		var newX = targetAirplane.path[0].x;
		var newY = targetAirplane.path[0].y;
		var distance = getDistanceByValue(targetAirplane.x, targetAirplane.y, newX, newY);
		var speedTween = (targetAirplane.speed-gameData.speed) * (distance * 0.02);
		var newRotate = getDirectionByValue(targetAirplane.x, targetAirplane.y, newX, newY);
		var scaleNum = targetAirplane.scaleNum;
		var alphaNum = 1;
		targetAirplane.path.splice(0,1);
		
		var pathArray = [];
		pathArray.push({x:targetAirplane.x, y:targetAirplane.y});
		pathArray.push({x:newX, y:newY});
		
		if(targetAirplane.runwayType == 0 && targetAirplane.runwayGuide == 3){
			var guideStart = gameData.runway[targetAirplane.runwayNum].guideStart;
			var guideMiddle = gameData.runway[targetAirplane.runwayNum].guideMiddle;
			var guideAlpha = gameData.runway[targetAirplane.runwayNum].guideAlpha;
			var guideEnd = gameData.runway[targetAirplane.runwayNum].guideEnd;
			
			var intersection1 = collisionMethod(guideStart, targetAirplane);
			var intersection2 = collisionMethod(guideMiddle, targetAirplane);
			var intersection3 = collisionMethod(guideAlpha, targetAirplane);
			var intersection4 = collisionMethod(guideEnd, targetAirplane);
			
			if(intersection1 && !targetAirplane.landed){
				targetAirplane.runwayGuidePlane = 0;
				targetAirplane.scaleNum = .8;
				targetAirplane.landed = true;
				planeContainer.setChildIndex(targetAirplane, 0);
			}else if(intersection2 && targetAirplane.runwayGuidePlane == 0){
				targetAirplane.runwayGuidePlane = 1;
			}else if(intersection3 && targetAirplane.runwayGuidePlane == 1){
				targetAirplane.runwayGuidePlane = 2;
				alphaNum = 0;
				targetAirplane.completed = true;
			}else if(intersection4 && targetAirplane.runwayGuidePlane == 2){
				targetAirplane.runwayGuidePlane = 3;
			}
		}else if(targetAirplane.runwayType == 1 && targetAirplane.runwayGuide == 3){
			var guideStart = gameData.runway[targetAirplane.runwayNum].guideStart;
			var intersection1 = collisionMethod(guideStart, targetAirplane);
			
			if(intersection1){
				targetAirplane.scaleNum = .8;
				alphaNum = 0;
				targetAirplane.landed = true;
				targetAirplane.completed = true;
			}
		}
		
		var scaleNum = targetAirplane.scaleNum;
		TweenMax.to(targetAirplane, speedTween, {bezier:{type:"thru", values:pathArray, curviness:1, autoRotate:true}, alpha:alphaNum, scaleX:scaleNum, scaleY:scaleNum, overwrite:true, ease:Linear.easeNone, onComplete:animatePlanePathComplete, onCompleteParams:[targetAirplane]});
	}
}

function animatePlanePathComplete(targetAirplane){
	updatePlaneStroke(targetAirplane);
	targetAirplane.pathed = false;
	
	if(targetAirplane.completed){
		//landed
		increaseScore(targetAirplane);
		increaseTotal();
		removePlane(targetAirplane);
	}else if(targetAirplane.path.length > 0){
		//continue path
		//animatePlanePath(targetAirplane);		
	}else{
		//lost
		animatePlaneRandomPos(targetAirplane, true);	
	}
}

/*!
 * 
 * UPDATE PLANE STROKE - This is the function that update plane stroke
 * 
 */
function updatePlaneStroke(targetAirplane){
	var drawingStroke = targetAirplane.drawingStroke;
	drawingStroke.graphics.clear();
	
	if(targetAirplane.path.length > 0){
		var drawing = false;
		var curStrokeColor = lostStrokeColor;
		var curStrokeStyle = lostStrokeStyle;
		var curStrokeAlpha = lostStrokeAlpha;
		
		if(targetAirplane.runwayGuide == 3){
			curStrokeColor = strokeColor;
			curStrokeStyle = strokeStyle;	
			curStrokeAlpha = strokeAlpha;
		}
		
		if(targetAirplane == gameData.targetPlane){
			drawing = true;
			curStrokeAlpha = drawStrokeAlpha;
			curStrokeColor = drawStrokeColor;
			curStrokeStyle = drawStrokeStyle;
		}else{
			curStrokeAlpha = strokeAlpha;
			drawingStroke.graphics.beginStroke(curStrokeColor)
						  .setStrokeStyle(curStrokeStyle, "round")
						  .moveTo(targetAirplane.path[0].x, targetAirplane.path[0].y);	
		}
		drawingStroke.alpha = curStrokeAlpha;
		
		var dotX = targetAirplane.path[0].x;
		var dotY = targetAirplane.path[0].y;
		var oldX = dotX;
		var oldY = dotY;
			  
		for(var p=0;p<targetAirplane.path.length;p++){
			if(drawing){
				if(targetAirplane.path[p].dotted){
					drawingStroke.graphics.beginStroke(curStrokeColor)
							  .setStrokeStyle(curStrokeStyle, "round")
							  .moveTo(oldX, oldY)
							  .lineTo(targetAirplane.path[p].x, targetAirplane.path[p].y);
				}else{
					oldX = targetAirplane.path[p].x;
					oldY = targetAirplane.path[p].y;	
				}
			}else{
				drawingStroke.graphics.lineTo(targetAirplane.path[p].x, targetAirplane.path[p].y);	
			}
		}
	}	
}


/*!
 * 
 * UPDATE GAME STATUS - This is the function that runs to update game score status
 * 
 */
function increaseScore(plane){
	playSound('soundScore');
	var distanceSpeed = 2 - plane.speed;
	var distanceTimer = (plane.bonusTimer/1000)%60;
	var bonusTime = 60 - (distanceTimer * distanceSpeed);
	scoreBonus = Math.floor((bonusTime * 0.01) * scorePoint);
	scoreBonus = scoreBonus < 0 ? 0 : scoreBonus;
	
	playerData.score+=(scorePoint+scoreBonus);
	updateStatus();
}

function increaseTotal(){
	playerData.total++;
	updateStatus();
	
	if(playerData.total == gameData.totalPlane){
		gameData.stageComplete = true;
		endGame();	
	}
}

function updateStatus(){
	var landedText = landedTextDisplay.replace('[NUMBER]',playerData.total);
	landedTxt.text = landedShadowTxt.text = landedText.replace('[TOTAL]',gameData.totalPlane);
	scoreTxt.text = scoreShadowTxt.text = scoreTextDisplay.replace('[NUMBER]',playerData.score);
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", addCommas(playerData.score));
	title = title.replace("[LEVEL]", gameData.levelNum+1);
	text = shareMessage.replace("[SCORE]", addCommas(playerData.score));
	text = text.replace("[LEVEL]", gameData.levelNum+1);
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}