////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/button_start.png', id:'buttonStart'},
			
			{src:'assets/item_tutorial.png', id:'itemTutorial'},
			{src:'assets/item_runway_hit.png', id:'itemRunwayHit'},
			{src:'assets/item_runway_guide.png', id:'itemRunwayGuide'},
			{src:'assets/item_helipad_hit.png', id:'itemHelipadHit'},
			{src:'assets/item_helipad_guide.png', id:'itemHelipadGuide'},
			{src:'assets/item_square.png', id:'itemSquare'},
			{src:'assets/button_rotate.png', id:'buttonRotate'},
			{src:'assets/arrow_Spritesheet3x2.png', id:'itemRunwayAnimate'},
			{src:'assets/circle_Spritesheet3x2.png', id:'itemHelipadAnimate'},
			
			{src:'assets/item_alert.png', id:'itemAlert'},
			{src:'assets/item_collision_outer.png', id:'itemCollisionOuter'},
			{src:'assets/item_collision_inner.png', id:'itemCollisionInner'},
			{src:'assets/item_boom.png', id:'itemBoom'},
			{src:'assets/item_completed.png', id:'itemCompleted'},
			
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			{src:'assets/item_exit.png', id:'itemExit'},
			
			{src:'assets/button_arrow.png', id:'buttonArrow'},
			{src:'assets/icon_level.png', id:'iconLevel'},
			{src:'assets/icon_level_lock.png', id:'iconLevelLock'},
			
			{src:'assets/item_result.png', id:'itemResult'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'}];
	
	for(var n=0;n<levels_arr.length;n++){
		manifest.push({src:levels_arr[n].level.src, id:'stage'+n});
	}
	
	for(var n=0;n<airplane_arr.length;n++){
		manifest.push({src:airplane_arr[n].src, id:'airplane'+n});
	}
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/music_main.ogg', id:'musicMain'});
		manifest.push({src:'assets/sounds/music_game.ogg', id:'musicGame'});
		
		manifest.push({src:'assets/sounds/click.ogg', id:'soundClick'});
		manifest.push({src:'assets/sounds/select.ogg', id:'soundSelect'});
		manifest.push({src:'assets/sounds/boom.ogg', id:'soundBoom'});
		manifest.push({src:'assets/sounds/collision.ogg', id:'soundCollision'});
		
		manifest.push({src:'assets/sounds/score.ogg', id:'soundScore'});
		manifest.push({src:'assets/sounds/fail.ogg', id:'soundFail'});
		manifest.push({src:'assets/sounds/complete.ogg', id:'soundComplete'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}