////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);	
}

var guide = false;
var canvasContainer, mainContainer, selectContainer, gameContainer, linesContainer, planeContainer, collisionContainer, runwayContainer, levelContainer, completeContainer, statusContainer, editContainer, confirmContainer, resultContainer;
var guideline, bg, logo, buttonStart, buttonContinue, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff;

$.airplane = {};
$.selectStage = {};
$.stage = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	selectContainer = new createjs.Container();
	tutorialContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	linesContainer = new createjs.Container();
	planeContainer = new createjs.Container();
	runwayContainer = new createjs.Container();
	collisionContainer = new createjs.Container();
	statusContainer = new createjs.Container();
	levelContainer = new createjs.Container();
	editContainer = new createjs.Container();
	completeContainer = new createjs.Container();
	confirmContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);
	buttonStart.x = canvasW/2;
	buttonStart.y = canvasH/100 * 77;
	
	//select
	itemSelect = new createjs.Bitmap(loader.getResult('itemResult'));
	centerReg(itemSelect);
	itemSelect.x = canvasW/2;
	itemSelect.y = canvasH/2;
	
	buttonArrowL = new createjs.Bitmap(loader.getResult('buttonArrow'));
	centerReg(buttonArrowL);
	
	buttonArrowR = new createjs.Bitmap(loader.getResult('buttonArrow'));
	centerReg(buttonArrowR);
	
	buttonArrowL.x = canvasW/100 * 43;
	buttonArrowL.y = canvasH/100 * 70;
	buttonArrowL.scaleX = -1;
	
	buttonArrowR.x = canvasW/100 * 57;
	buttonArrowR.y = canvasH/100 * 70;
	
	selectTitleTxt = new createjs.Text();
	selectTitleTxt.font = "50px dimboregular";
	selectTitleTxt.color = "#fff";
	selectTitleTxt.textAlign = "center";
	selectTitleTxt.textBaseline='alphabetic';
	selectTitleTxt.text = selectTitleText;
	
	selectTitleTxt.x = canvasW/2;
	selectTitleTxt.y = canvasH/100 * 30;
	
	selectContainer.addChild(itemSelect, selectTitleTxt, buttonArrowL, buttonArrowR);
	
	var colCount = 1;
	var rowCount = 1;
	var startX = canvasW/100 * 33;
	var startY = canvasH/100 * 42;
	var curX = startX;
	var curY = startY;
	var spaceX = 109;
	var spaceY = 95;
	
	for(var n=0;n<levels_arr.length;n++){
		$.selectStage['icon_'+n] = new createjs.Bitmap(loader.getResult('iconLevel'));
		centerReg($.selectStage['icon_'+n]);
		
		$.selectStage['iconLock_'+n] = new createjs.Bitmap(loader.getResult('iconLevelLock'));
		centerReg($.selectStage['iconLock_'+n]);
		
		$.selectStage['iconText_'+n] = new createjs.Text();
		$.selectStage['iconText_'+n].font = "40px dimboregular";
		$.selectStage['iconText_'+n].color = "#fff";
		$.selectStage['iconText_'+n].textAlign = "center";
		$.selectStage['iconText_'+n].textBaseline='alphabetic';
		$.selectStage['iconText_'+n].text = n+1;
		
		$.selectStage['icon_'+n].x = $.selectStage['iconLock_'+n].x = $.selectStage['iconText_'+n].x = curX;
		$.selectStage['icon_'+n].y = $.selectStage['iconLock_'+n].y = curY;
		$.selectStage['iconText_'+n].y = curY+13;
		
		curX += spaceX;
		colCount++;
		if(colCount>5){
			colCount = 1;
			curX = startX;
			curY += spaceY;
			rowCount++;
		}
		
		if(rowCount > 2){
			rowCount = 1;
			curX = startX;
			curY = startY;
		}
		
		selectContainer.addChild($.selectStage['icon_'+n], $.selectStage['iconText_'+n], $.selectStage['iconLock_'+n]);
	}
	
	//tutorial
	itemTutorial = new createjs.Bitmap(loader.getResult('itemTutorial'));
	
	buttonTutContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonTutContinue);
	createHitarea(buttonTutContinue);
	buttonTutContinue.x = canvasW/2;
	buttonTutContinue.y = canvasH/100 * 70;
	
	//game
	for(n=0;n<levels_arr.length;n++){
		$.stage[n] = new createjs.Bitmap(loader.getResult('stage'+n));
		levelContainer.addChild($.stage[n]);
	}
	
	itemSquare = new createjs.Bitmap(loader.getResult('itemSquare'));
	centerReg(itemSquare);
	itemSquare.x = -200;
	itemSquare.alpha = 0;
	itemRunwayHit = new createjs.Bitmap(loader.getResult('itemRunwayHit'));
	centerReg(itemRunwayHit);
	itemRunwayHit.x = -200;
	itemRunwayGuide = new createjs.Bitmap(loader.getResult('itemRunwayGuide'));
	centerReg(itemRunwayGuide);
	itemRunwayGuide.regX = 0;
	itemRunwayGuide.x = -500;
	
	itemHelipadHit = new createjs.Bitmap(loader.getResult('itemHelipadHit'));
	centerReg(itemHelipadHit);
	itemHelipadHit.x = -200;
	itemHelipadGuide = new createjs.Bitmap(loader.getResult('itemHelipadGuide'));
	centerReg(itemHelipadGuide);
	itemHelipadGuide.x = -500;
	
	for(var n=0;n<airplane_arr.length;n++){
		var _frameW = airplane_arr[n].width;
		var _frameH = airplane_arr[n].height;
		
		var _frame = {"regX": _frameW/2, "regY": _frameH/2, "height": _frameH, "count": 2, "width": _frameW};
		var _animations = {animate:{frames: [0,1], speed:1}};
							
		$.airplane[n+'Data'] = new createjs.SpriteSheet({
			"images": [loader.getResult('airplane'+n).src],
			"frames": _frame,
			"animations": _animations
		});
		
		$.airplane[n] = new createjs.Sprite($.airplane[n+'Data'], "animate");
		$.airplane[n].framerate = 20;
		$.airplane[n].x = -200;
		
		gameContainer.addChild($.airplane[n]);
	}
	
	var _frameW = 122;
	var _frameH = 30;
	var _frame = {"regX": 0, "regY": _frameH/2, "height": _frameH, "count": 5, "width": _frameW};
	var _animations = {animate:{frames: [0,1,2,3,4], speed:.5}};
						
	itemRunwayData = new createjs.SpriteSheet({
		"images": [loader.getResult('itemRunwayAnimate').src],
		"frames": _frame,
		"animations": _animations
	});
	
	itemRunwayAnimate = new createjs.Sprite(itemRunwayData, "animate");
	itemRunwayAnimate.framerate = 20;
	itemRunwayAnimate.x = -200;
	
	var _frameW = 90;
	var _frameH = 90;
	var _frame = {"regX": _frameW/2, "regY": _frameH/2, "height": _frameH, "count": 5, "width": _frameW};
	var _animations = {animate:{frames: [0,1,2,3,4], speed:.5}};
						
	itemHelipadData = new createjs.SpriteSheet({
		"images": [loader.getResult('itemHelipadAnimate').src],
		"frames": _frame,
		"animations": _animations
	});
	
	itemHelipadAnimate = new createjs.Sprite(itemHelipadData, "animate");
	itemHelipadAnimate.framerate = 20;
	itemHelipadAnimate.x = -100;
	
	gameContainer.addChild(itemRunwayAnimate, itemHelipadAnimate);
	
	itemAlert = new createjs.Bitmap(loader.getResult('itemAlert'));
	centerReg(itemAlert);
	itemAlert.x = -100;
	itemCollisionOuter = new createjs.Bitmap(loader.getResult('itemCollisionOuter'));
	centerReg(itemCollisionOuter);
	itemCollisionOuter.x = -100;
	itemCollisionInner = new createjs.Bitmap(loader.getResult('itemCollisionInner'));
	centerReg(itemCollisionInner);
	itemCollisionInner.x = -100;
	
	itemBoom = new createjs.Bitmap(loader.getResult('itemBoom'));
	centerReg(itemBoom);
	itemBoom.x = -100;
	
	landedTxt = new createjs.Text();
	landedTxt.font = "50px dimboregular";
	landedTxt.color = "#fff";
	landedTxt.textAlign = "left";
	landedTxt.textBaseline='alphabetic';
	landedTxt.text = 'LANDED: 10';
	
	landedShadowTxt = new createjs.Text();
	landedShadowTxt.font = "50px dimboregular";
	landedShadowTxt.color = "#555555";
	landedShadowTxt.textAlign = "left";
	landedShadowTxt.textBaseline='alphabetic';
	landedShadowTxt.text = 'LANDED: 10';
	
	scoreTxt = new createjs.Text();
	scoreTxt.font = "60px dimboregular";
	scoreTxt.color = "#fff";
	scoreTxt.textAlign = "center";
	scoreTxt.textBaseline='alphabetic';
	scoreTxt.text = '1500PTS';
	
	scoreShadowTxt = new createjs.Text();
	scoreShadowTxt.font = "55px dimboregular";
	scoreShadowTxt.color = "#555555";
	scoreShadowTxt.textAlign = "center";
	scoreShadowTxt.textBaseline='alphabetic';
	scoreShadowTxt.text = '1500PTS';
	
	itemCompleted = new createjs.Bitmap(loader.getResult('itemCompleted'));
	centerReg(itemCompleted);
	levelCompletedTxt = new createjs.Text();
	levelCompletedTxt.font = "60px dimboregular";
	levelCompletedTxt.color = "#fff";
	levelCompletedTxt.textAlign = "center";
	levelCompletedTxt.textBaseline='alphabetic';
	levelCompletedTxt.text = levelCompletedText;
	levelCompletedTxt.y = 20
	completeContainer.addChild(itemCompleted, levelCompletedTxt);
	completeContainer.x = canvasW/2;
	completeContainer.y = canvasH/2;
	
	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemResult'));
	centerReg(itemResult);
	itemResult.x = canvasW/2;
	itemResult.y = canvasH/2;
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "50px dimboregular";
	resultTitleTxt.color = "#fff";
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = 'STAGE 1 COMPLETE';
	resultTitleTxt.x = canvasW/2;
	resultTitleTxt.y = canvasH/100 * 30;
	
	resultScoreTxt = new createjs.Text();
	resultScoreTxt.font = "100px dimboregular";
	resultScoreTxt.color = "#663366";
	resultScoreTxt.textAlign = "center";
	resultScoreTxt.textBaseline='alphabetic';
	resultScoreTxt.text = '1500PTS';
	resultScoreTxt.x = canvasW/2;
	resultScoreTxt.y = canvasH/100 * 46;
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "25px dimboregular";
	resultShareTxt.color = "#555";
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = shareText;
	resultShareTxt.x = canvasW/2;
	resultShareTxt.y = canvasH/100 * 52;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonWhatsapp);
	createHitarea(buttonWhatsapp);
	buttonFacebook.x = canvasW/100 * 44;
	buttonTwitter.x = canvasW/2;
	buttonWhatsapp.x = canvasW/100 * 56;
	buttonFacebook.y = buttonTwitter.y = buttonWhatsapp.y = canvasH/100*58;
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	createHitarea(buttonContinue);
	buttonContinue.x = canvasW/2;
	buttonContinue.y = canvasH/100 * 70;
	
	//option
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	buttonConfirm.x = canvasW/100* 40;
	buttonConfirm.y = canvasH/100 * 67;
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	buttonCancel.x = canvasW/100 * 60;
	buttonCancel.y = canvasH/100 * 67;
	
	confirmMessageTxt = new createjs.Text();
	confirmMessageTxt.font = "45px dimboregular";
	confirmMessageTxt.color = "#663366";
	confirmMessageTxt.textAlign = "center";
	confirmMessageTxt.textBaseline='alphabetic';
	confirmMessageTxt.text = exitMessage;
	confirmMessageTxt.x = canvasW/2;
	confirmMessageTxt.y = canvasH/100 *47;
	
	confirmContainer.addChild(itemExit, buttonConfirm, buttonCancel, confirmMessageTxt);
	confirmContainer.visible = false;
	
	if(guide){
		guideline = new createjs.Shape();
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	mainContainer.addChild(logo, buttonStart);
	statusContainer.addChild(landedShadowTxt, landedTxt, scoreShadowTxt, scoreTxt);
	tutorialContainer.addChild(itemTutorial, buttonTutContinue);
	gameContainer.addChild(itemAlert, itemCollisionOuter, itemCollisionInner, itemSquare, itemHelipadHit, itemHelipadGuide, itemRunwayHit, itemRunwayGuide, levelContainer, editContainer, runwayContainer, collisionContainer, linesContainer, planeContainer, itemBoom, completeContainer, statusContainer, tutorialContainer);
	resultContainer.addChild(itemResult, resultTitleTxt, resultScoreTxt, buttonContinue);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonWhatsapp);
	}
	
	canvasContainer.addChild(bg, mainContainer, selectContainer, gameContainer, resultContainer, confirmContainer, optionsContainer, buttonSettings, guideline);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		landedTxt.x = offset.x+20;
		landedShadowTxt.x = landedTxt.x
		landedTxt.y = offset.y+50;
		landedShadowTxt.y = landedTxt.y + 5;
		
		scoreTxt.x = canvasW/2;
		scoreShadowTxt.x = scoreTxt.x
		scoreTxt.y = offset.y+60;
		scoreShadowTxt.y = scoreTxt.y + 5;
		
		
		buttonSettings.x = (canvasW - offset.x) - 60;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 60;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*3);
		}
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));
}