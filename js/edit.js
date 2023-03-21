////////////////////////////////////////////////////////////
// EDIT PUZZLES
////////////////////////////////////////////////////////////
var edit = {show:true, option:'', targetRunway:null};
var gridHoverColour = '#000';
var gridPathColour = '#36D900';
var gridDefaultColour = '#FF7F00';

/*!
 * 
 * EDIT READY
 * 
 */
$(function() {
	 $.editor.enable = true;
});

function loadEditPage(){
	jQuery.ajax({ 
		 url: "editTools.html", dataType: "html" 
	}).done(function( responseHtml ) {
		$("body").prepend(responseHtml);
		
		buildEditCanvas();
		buildEditButtons();
		$('#editWrapper').show();
		toggleEditOption();
		reloadEditLevel(true);
		
		completeContainer.visible = statusContainer.visible = buttonExit.visible = false;
	});
}

function buildEditButtons(){
	$('#toggleShowOption').click(function(){
		toggleShowOption();
	});
	
	buildLevelDD();
	$("#levellist").change(function() {
		if($(this).val() != ''){
			gameData.levelNum = Number($(this).val());
			toggleEditOption();
			reloadEditLevel(true);
		}
	});
	
	$('#prevLevel').click(function(){
		toggleLevel(false);
	});
	
	$('#nextLevel').click(function(){
		toggleLevel(true);
	});
	
	$('#addNewLevel').click(function(){
		actionLevel('new');
	});
	
	$('#removeLevel').click(function(){
		actionLevel('remove');
	});
	
	$('#moveLevelUp').click(function(){
		actionLevel('moveup');
	});
	
	$('#moveLevelDown').click(function(){
		actionLevel('movedown');
	});
	
	//option
	$('#editLevel').click(function(){
		toggleEditOption('level');
	});
	
	$('#editRunway').click(function(){
		toggleEditOption('runway');
	});
	
	$('#testPlay').click(function(){
		toggleEditOption('play');
	});
	
	$('#stopTestPlay').click(function(){
		toggleEditOption('stop');
	});
	
	$('#generateArray').click(function(){
		generateArray();
	});
	
	//level
	$('#updateLevel').click(function(){
		updateLevelData();
	});
	
	$('#doneLevel').click(function(){
		toggleEditOption();
	});
	
	//runway
	$("#runwayList").change(function() {
		if($(this).val() != ''){
			if(Number($(this).val()) != $.editor.runwayNum){
				$.editor.runwayNum = Number($(this).val());
				
				$('#runwayX').val(levels_arr[gameData.levelNum].runway[$.editor.runwayNum].x);
				$('#runwayY').val(levels_arr[gameData.levelNum].runway[$.editor.runwayNum].y);
				$('#runwayRotation').val(levels_arr[gameData.levelNum].runway[$.editor.runwayNum].rotation);
				$('#runwayPlanes').val(levels_arr[gameData.levelNum].runway[$.editor.runwayNum].planes);
				$('#runwayType').prop("selectedIndex", levels_arr[gameData.levelNum].runway[$.editor.runwayNum].type);
				$('#editRunwayValueWrapper').show();
				
				buildRunwayDD();
				reloadEditLevel(false);
			}
		}
	});
	
	$('#addRunway').click(function(){
		actionRunway('new');
	});
	
	$('#removeRunway').click(function(){
		actionRunway('remove');
	});
	
	$("#runwayType").change(function() {
		if($(this).val() != ''){
			if(Number($(this).val()) != levels_arr[gameData.levelNum].runway[$.editor.runwayNum].type){
				levels_arr[gameData.levelNum].runway[$.editor.runwayNum].type = Number($(this).val());
				
				buildRunwayDD();
				reloadEditLevel(false);
			}
		}
	});
	
	$('#updateRunway').click(function(){
		updateRunwayData();
	});
	
	$('#doneRunway').click(function(){
		toggleEditOption();
	});
	
	buttonRotateL.cursor = "pointer";
	buttonRotateL.addEventListener("mousedown", function(evt) {
		toggleRotateNumber(false);
	});
	buttonRotateL.addEventListener("pressup", function(evt) {
		toggleRotateNumber();
	});
	
	buttonRotateR.cursor = "pointer";
	buttonRotateR.addEventListener("mousedown", function(evt) {
		toggleRotateNumber(true);
	});
	buttonRotateR.addEventListener("pressup", function(evt) {
		toggleRotateNumber();
	});
}

/*!
 * 
 * ADD/DEDUCT BET NUMBER - This is the function that runs to add or deduct bet number
 * 
 */
var rotateNumberInterval = null;
var rotateNumberTimer = 0;
var rotateNumberTimerMax = 300;
var rotateNumberTimerMin = 10;
var rotateNumber = 0;

function toggleRotateNumber(con){
	if(con){
		rotateNumber = 1;
	}else if(!con){
		rotateNumber = -1;
	}else{
		rotateNumber = 0;	
	}
	
	if(con != undefined){
		rotateNumberTimer = rotateNumberTimerMax;
		loopRotateNumber();
	}else{
		clearInterval(rotateNumberInterval);	
		rotateNumberInterval = null;
	}
}

function loopRotateNumber(){
	clearInterval(rotateNumberInterval);
	rotateNumberInterval = setInterval(loopRotateNumber, rotateNumberTimer);
	rotateNumberTimer-=100;
	rotateNumberTimer=rotateNumberTimer<rotateNumberTimerMin?rotateNumberTimerMin:rotateNumberTimer;
	
	updateRotateNumber();
}

function updateRotateNumber(){
	edit.targetRunway.rotation += rotateNumber;
	if(rotateNumber > 0){
		edit.targetRunway.rotation = edit.targetRunway.rotation >= 360 ? 0 : edit.targetRunway.rotation;
	}else{
		edit.targetRunway.rotation = edit.targetRunway.rotation <= 0 ? 360 : edit.targetRunway.rotation;	
	}
	
	levels_arr[gameData.levelNum].runway[$.editor.runwayNum].rotation = Number(edit.targetRunway.rotation);
	$('#runwayRotation').val(edit.targetRunway.rotation);
}

 /*!
 * 
 * TOGGLE DISPLAY OPTION - This is the function that runs to toggle display option
 * 
 */
 
function toggleShowOption(){
	if(edit.show){
		edit.show = false;
		$('#editOption').hide();
		$('#toggleShowOption').val('Show Edit Option');
	}else{
		edit.show = true;
		$('#editOption').show();
		$('#toggleShowOption').val('Hide Edit Option');
	}
}

 /*!
 * 
 * TOGGLE EDIT OPTIONS - This is the function that runs to toggle edit options
 * 
 */
function toggleEditOption(con){
	edit.option = con;
	$.editor.runwayNum = -1;
	
	$('#actionWrapper').hide();
	$('#playWrapper').hide();
	$('#editLevelWrapper').hide();
	$('#editRunwayWrapper').hide();
	$('#editRunwayValueWrapper').hide();
	$('#playWrapper').hide();
	$('#editRunwayWrapper').hide();
	editToolContainer.visible = false;
	
	if(con == 'level'){
		$('#editLevelWrapper').show();
		$('#levelImage').val(levels_arr[gameData.levelNum].level.src);
		$('#levelTotalPlanes').val(levels_arr[gameData.levelNum].level.total);
		$('#levelPlaneSpeed').val(levels_arr[gameData.levelNum].level.speed);
		$('#levelNextPlaneTimer').val(levels_arr[gameData.levelNum].level.planTimer);
	}else if(con == 'runway'){
		$('#editRunwayWrapper').show();
		buildRunwayDD();
	}else if(con == 'play'){
		$('#playWrapper').show();
		toggleGamePlay(true);
	}else if(con == 'stop'){
		toggleGamePlay(false);
		toggleEditOption();
	}else{
		$('#actionWrapper').show();
	}
	
	reloadEditLevel(false);
}

 /*!
 * 
 * BUILD EDIT CANVAS - This is the function that runs to build edit canvas
 * 
 */
var editLevelContainer, editRunwayContainer, editToolContainer;
$.editObj = {};

function buildEditCanvas(){
	editLevelContainer = new createjs.Container();
	editRunwayContainer = new createjs.Container();
	editToolContainer = new createjs.Container();
	
	buttonRotateL = new createjs.Bitmap(loader.getResult('buttonRotate'));
	centerReg(buttonRotateL);
	buttonRotateL.scaleX = -1;
	buttonRotateR = new createjs.Bitmap(loader.getResult('buttonRotate'));
	centerReg(buttonRotateR);
	buttonRotateL.x = -20;
	buttonRotateR.x = 20;
	buttonRotateL.y = buttonRotateR.y = 50;
	
	editToolContainer.addChild(buttonRotateL, buttonRotateR);
	editContainer.addChild(editLevelContainer, editRunwayContainer, editToolContainer);
}

/*!
 * 
 * SETUP OBJECTS EVENTS - This is the function that runs to setup objects events
 * 
 */
function buildGridEvents(obj){
	obj.addEventListener("mouseover", function(evt) {
		toggleGridEvent(evt, 'over')
	});
	obj.addEventListener("mouseout", function(evt) {
		toggleGridEvent(evt, 'out')
	});
	obj.addEventListener("pressup", function(evt) {
		toggleGridEvent(evt, 'up')
	});
}

function toggleGridEvent(obj, con){
	switch(con){
		case 'over':
			edit.hover[obj.target.r][obj.target.c].alpha = .5;
		break;
		
		case 'out':
			edit.hover[obj.target.r][obj.target.c].alpha = 0;
		break;
		
		case 'up':
			updatePathData(obj.target.r, obj.target.c);
		break;
	}
}

/*!
 * 
 * TOGGLE STAGE - This is the function that runs to toggle levels
 * 
 */
function toggleLevel(con){
	if(con){
		gameData.levelNum++;
		gameData.levelNum = gameData.levelNum > levels_arr.length - 1 ? 0 : gameData.levelNum;
	}else{
		gameData.levelNum--;
		gameData.levelNum = gameData.levelNum < 0 ? levels_arr.length - 1 : gameData.levelNum;
	}
	$('#levellist').prop("selectedIndex", gameData.levelNum);
	reloadEditLevel(true);
}

/*!
 * 
 * ACTION STAGE - This is the function that runs to action level
 * 
 */
function actionLevel(con){
	switch(con){
		case 'new':
			levels_arr.push({level:{src:'assets/stage1.png', total:10, speed:0, planTimer:6}, runway:[]});
			gameData.levelNum = levels_arr.length-1;
		break;
		
		case 'remove':
			levels_arr.splice(gameData.levelNum, 1);
			gameData.levelNum = 0;
		break;
		
		case 'moveup':
			if(gameData.levelNum-1 >= 0){
				swapArray(levels_arr, gameData.levelNum-1, gameData.levelNum);
				gameData.levelNum--;
			}
		break;
		
		case 'movedown':
			if(gameData.levelNum+1 < levels_arr.length){
				swapArray(levels_arr, gameData.levelNum+1, gameData.levelNum);
				gameData.levelNum++;
			}
		break;
	}
	
	buildLevelDD();
	reloadEditLevel(true);
}

function buildLevelDD(){
	$('#levellist').empty();
	for(n=0;n<levels_arr.length;n++){
		$('#levellist').append($("<option/>", {
			value: n,
			text: 'Level '+(n+1)
		}));
	}	
	
	$('#levellist').prop("selectedIndex", gameData.levelNum);
}

/*!
 * 
 * UPDATE STAGE DATA - This is the function that runs to update level data
 * 
 */
function updateLevelData(){
	levels_arr[gameData.levelNum].level.src = $('#levelImage').val();
	levels_arr[gameData.levelNum].level.total = Number($('#levelTotalPlanes').val());
	levels_arr[gameData.levelNum].level.speed = Number($('#levelPlaneSpeed').val());
	levels_arr[gameData.levelNum].level.planTimer = Number($('#levelNextPlaneTimer').val());
	
	reloadEditLevel(true);
}

/*!
 * 
 * UPDATE RUNWAY DATA - This is the function that runs to update runway data
 * 
 */
function updateRunwayData(){
	levels_arr[gameData.levelNum].runway[$.editor.runwayNum].x = Number($('#runwayX').val());
	levels_arr[gameData.levelNum].runway[$.editor.runwayNum].y = Number($('#runwayY').val());
	levels_arr[gameData.levelNum].runway[$.editor.runwayNum].rotation = Number($('#runwayRotation').val());
	levels_arr[gameData.levelNum].runway[$.editor.runwayNum].planes = $('#runwayPlanes').val().split(',');
	
	for(var n=0;n<levels_arr[gameData.levelNum].runway[$.editor.runwayNum].planes.length;n++){
		levels_arr[gameData.levelNum].runway[$.editor.runwayNum].planes[n]=parseInt(levels_arr[gameData.levelNum].runway[$.editor.runwayNum].planes[n]);
	}
	
	reloadEditLevel(true);
}

/*!
 * 
 * ACTION PATH - This is the function that runs to action path
 * 
 */
function actionRunway(con){
	switch(con){
		case 'new':
			levels_arr[gameData.levelNum].runway.push({x:200, y:200, rotation:0, type:0, planes:[0,1]});
			$.editor.runwayNum = levels_arr[gameData.levelNum].runway.length-1;
		break;
		
		case 'remove':
			levels_arr[gameData.levelNum].runway.splice($.editor.runwayNum, 1);
			$.editor.runwayNum = 0;
			if(levels_arr[gameData.levelNum].runway.length == 0){
				actionRunway('new');	
			}
		break;
	}
	
	buildRunwayDD();
	reloadEditLevel(false);
}

function buildRunwayDD(){
	$('#runwayList').empty();
	for(n=0;n<levels_arr[gameData.levelNum].runway.length;n++){
		$('#runwayList').append($("<option/>", {
			value: n,
			text: 'Runway '+(n+1)
		}));
	}	
	
	$('#runwayList').prop("selectedIndex", $.editor.runwayNum);
}

/*!
 * 
 * SETUP OBJECTS EVENTS - This is the function that runs to setup objects events
 * 
 */
function buildDragAndDrop(obj){
	obj.addEventListener("mousedown", function(evt) {
		toggleDragEvent(evt, 'drag')
	});
	obj.addEventListener("pressmove", function(evt) {
		toggleDragEvent(evt, 'move')
	});
	obj.addEventListener("pressup", function(evt) {
		toggleDragEvent(evt, 'release');
	});
}

function toggleObjActive(obj, con){
	if(con){
		obj.active = true;
		obj.cursor = "pointer";
		obj.alpha = .8;
		editToolContainer.x = obj.x;
		editToolContainer.y = obj.y;
		edit.targetRunway = obj;
		
		if(obj.runwayType == 0){
			editToolContainer.visible = true;
		}
	}else{
		obj.active = false;
		obj.cursor = "default";
		obj.alpha = .3;
	}
}

function toggleDragEvent(obj, con){
	if(obj.currentTarget.active){
		switch(con){
			case 'drag':
				obj.currentTarget.offset = {x:obj.currentTarget.x-(obj.stageX), y:obj.currentTarget.y- (obj.stageY)};
			break;
			
			case 'move':
				obj.currentTarget.x = Math.floor((obj.stageX) + obj.currentTarget.offset.x);
				obj.currentTarget.y = Math.floor((obj.stageY) + obj.currentTarget.offset.y);
				
				editToolContainer.x = obj.currentTarget.x;
				editToolContainer.y = obj.currentTarget.y;
				
				levels_arr[gameData.levelNum].runway[$.editor.runwayNum].x = obj.currentTarget.x;
				levels_arr[gameData.levelNum].runway[$.editor.runwayNum].y = obj.currentTarget.y;
				levels_arr[gameData.levelNum].runway[$.editor.runwayNum].rotation = obj.currentTarget.rotation;
				
				$('#runwayX').val(obj.currentTarget.x);
				$('#runwayY').val(obj.currentTarget.y);
				$('#runwayRotation').val(obj.currentTarget.rotation);
			break;
			
			case 'release':
				
			break;
		}
	}
}	

/*!
 * 
 * RELOAD EDIT STAGE - This is the function that runs to reload edit level
 * 
 */
function reloadEditLevel(con){
	editRunwayContainer.removeAllChildren();
	editToolContainer.visible = false;
	
	for(var n=0;n<levels_arr[gameData.levelNum].runway.length;n++){
		createRunway(true, levels_arr[gameData.levelNum].runway[n].type, levels_arr[gameData.levelNum].runway[n].x, levels_arr[gameData.levelNum].runway[n].y, levels_arr[gameData.levelNum].runway[n].rotation, n);
		
		if(edit.option == 'runway' && $.editor.runwayNum == n){
			toggleObjActive($.editObj[n], true);
		}else{
			toggleObjActive($.editObj[n], false);	
		}
	}
	
	if(con)
	loadLevelAssets();
}

/*!
 * 
 * LOAD STAGE PRELOADER - This is the function that runs to preload level image
 * 
 */
var editLoader, editFest;
function loadLevelAssets(){
	editFest = [];
	editLevelContainer.removeAllChildren();
	
	if(levels_arr[gameData.levelNum].level.src != ''){
		editFest.push({src:levels_arr[gameData.levelNum].level.src, id:'editLevel'});
		editLoader = new createjs.LoadQueue(false);	
		editLoader.addEventListener("complete", handleLevelComplete);
		editLoader.loadManifest(editFest);
	}
}

function handleLevelComplete() {
	var levelImage = new createjs.Bitmap(editLoader.getResult('editLevel'));
	editLevelContainer.addChild(levelImage);
};

/*!
 * 
 * GENERATE ARRAY - This is the function that runs to generate array
 * 
 */
function generateArray(){
	var outputArray = '';
	var space = '					';
	var space2 = '						';
	var space3 = '							';
	
	outputArray += "[\n";
	for(e=0;e<levels_arr.length;e++){
		var runwayArray = '';
		for(var p=0; p < levels_arr[e].runway.length; p++){
			runwayArray += "{x:"+levels_arr[e].runway[p].x+", y:"+levels_arr[e].runway[p].y+", rotation:"+levels_arr[e].runway[p].rotation+", type:"+levels_arr[e].runway[p].type+", planes:["+levels_arr[e].runway[p].planes+"]},";
		}
		
		outputArray += space+"{\n";
		outputArray += space2+"level:{src:'"+levels_arr[e].level.src+"', total:"+levels_arr[e].level.total+", speed:"+levels_arr[e].level.speed+", planTimer:"+levels_arr[e].level.planTimer+"},\n"+space2+"runway:["+runwayArray+"]\n";
		outputArray += space+"},\n\n";
	}
	outputArray += space+'];';
	$('#outputArray').val(outputArray);	
}

/*!
 * 
 * TOGGLE GAME PLAY - This is the function that runs to toggle game play
 * 
 */
function toggleGamePlay(con){
	editToolContainer.visible = true;
	editRunwayContainer.visible = true;
	statusContainer.visible = false;
	
	if(con){
		editToolContainer.visible = false;
		editRunwayContainer.visible = false;
		statusContainer.visible = true;
		toggleGameStatus('Game start:');
		startGame();
	}else{
		itemBoom.visible = false;
		stopGame();
	}
}

function toggleGameStatus(text){
	$('#gameStatus').html(text);
}