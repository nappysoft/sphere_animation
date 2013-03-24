"use strict";

function loadSphere() {
if (SPHERE && document.getElementById('mainDiv')) {
	SPHERE.load();
	var canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		div = document.getElementById('mainDiv'),
		posX = 100,posY = 100,
		animSprites = [];

	canvas.width = div.clientWidth;
	canvas.height = div.clientHeight;
	div.appendChild(canvas);

	canvas.addEventListener('mousemove',function (e) {
		//posX = e.clientX;
		//posY = e.clientY;
	});

	animSprites.push({
		name:'redBall',
		animID:'sphere_bounce',
		currentFrame:0,
		x: 100,
		y: 100
	});
	animSprites.push({
		name:'blueBall',
		animID:'sphere_blue_red_circle',
		currentFrame:0,
		x: 200,
		y: 200
	});

	var drawNextAnimationFrame = function drawAnimationFrame (context,timeDelta,animObj) {
		var ctx = context,
			anim = SPHERE.animations[animObj.animID];
	};

	(function (animList) {
		var anim = SPHERE.animations['sphere_blue_red_circle'],
			sheet = anim.sheet,
			frame,
			frameCount = anim.frameCount,
			frameNumber = 1,
			globalAnim = null,
			currentTick = new Date().getTime(),
			lastTick = currentTick,
			radians = Math.PI/180,
			frameDelay = 1000 / anim.fps;

	
		function nextFrame() {

			frame = anim.framesData[frameNumber-1];

			ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
			ctx.save();
			ctx.fillText(lastTick,5,15);

			ctx.translate(posX + frame.cx, posY + frame.cy);


			ctx.drawImage(sheet.img,frame.x,frame.y,frame.w,frame.h,
						0,0,
						frame.w,frame.h);
			ctx.restore();

			if (currentTick - lastTick >= frameDelay) {
				frameNumber = frameNumber % anim.frameCount + 1;
				lastTick = currentTick;
			}


		};

		globalAnim = requestAnimationFrame(function animate () {
			cancelAnimationFrame(globalAnim);
			currentTick = new Date().getTime();
			nextFrame();
			globalAnim = requestAnimationFrame(animate);
		});
	})(animSprites);	
} else {
	throw Error("Sphere is not loaded or the 'mainDiv' element is not avilable");
}

};

(function tests() {
	
})();
