"use strict";
// sphere.js
var SPHERE = {
	config: {
		uris: {
			"sphere_image" : "./sphere.png",
			"sphere_image_atlas" : "./sphere.json",
			"sphere_animations_atlas" : "./sphere.animations.json"
		}
	},
	images:{},
	sheets:{},
	imageMaps:{},
	animations:{},
	loadJSON: function (uri) {
		var xhr = new XMLHttpRequest(),
			parsed = null;
		xhr.open('GET',uri,false);
		xhr.requestType = null;
		xhr.onload = function (event) {
			var httpRequest = event.srcElement;
			if (httpRequest.status === 200) {
				parsed = JSON.parse(httpRequest.responseText);
			} else {
				console.log('failed to load [status: '+httpRequest.status+']');
			}
		};
		xhr.send();
		return {data:parsed,requestUri:uri};
	},
	load: function () {
		//this.loadJSON('./sphere.json');
		//this.loadJSON('./shpere.animations.json');

		// everything is local
		var local = this;
		// this.images['sphere.png'] = {
		// 	uri: this.config.uris['sphere_image'],
		// 	loaded: false,
		// 	img: null,
		// };
		this.imageMaps['sphere'] = {
			format:'json_hash',
			uri: this.config.uris['sphere_image_atlas'],
			loaded: false,
			data: null
		};
		this.sheets['sphere'] = {
			loaded: false,
			imageID: 'sphere.png',
			mapID: 'sphere',
			img: null,
			map: null
		};
		this.animations = {};
		
		// load imageMaps
		console.log('loading ImageMaps');
		for(var map in this.imageMaps) {
			if (this.imageMaps[map].format === 'json_hash') {
				this.imageMaps[map].data = this.loadJSON(this.imageMaps[map].uri).data;
				this.images[this.imageMaps[map].data.meta.image] = {
					uri: this.imageMaps[map].data.meta.image,
					loaded: false,
					img: null,
				};
				this.imageMaps[map].loaded = (this.imageMaps[map].data) ? true : false;
			}
		}
		// load images
		console.log('loading Images');
		for(var image in this.images) {
			// console.log('image: '+image);
			this.images[image].img = new Image();
			this.images[image].img.onload = function () {
				local.images[image].loaded = true;
				console.log(image + ': loaded');
			};
			this.images[image].img.src = this.images[image].uri;
		};
		
		// configure sheets
		console.log('configuring sheets');
		for(var sheet in this.sheets) {
			this.sheets[sheet].img = this.images[this.sheets[sheet].imageID].img;
			this.sheets[sheet].map = this.imageMaps[this.sheets[sheet].mapID].data;
			this.sheets[sheet].loaded = true;
		}
		//load animations
		console.log('loading and configuring animations');
		var animationListData = this.loadJSON(this.config.uris['sphere_animations_atlas']).data;
		// error check this data for null;
		for (var animIndex = 0; animIndex < animationListData['animations'].length; animIndex++) {
			
			var animDesc = animationListData['animations'][animIndex],
				animObj = {
					loaded: false,
					name: animDesc.name,
					direction: animDesc.direction,
					repeat: animDesc.repeat,
					fps: animDesc.fps,
					frameCount:animDesc.frameCount,
					sheet: this.sheets[animDesc.sheet],
					framesData:[]
				},
				sheet = animObj.sheet,
				map = sheet.map,
				frameIndex,
				frameName,
				frameData,
				cx = 0, cy = 0;

			for (frameIndex = 0; frameIndex < animDesc.frames.length; frameIndex++) {
				frameName = animDesc.frames[frameIndex];
				frameData = map.frames[frameName];
				// need to error check and translate the data
				if (frameData.trimmed) {
					// inverse
					cx = frameData.spriteSourceSize.x - (frameData.sourceSize.w * 0.5);
					cy = frameData.spriteSourceSize.y - (frameData.sourceSize.h * 0.5);
				} else {
					cx = -frameData.frame.w * 0.5;
					cy = -frameData.frame.w * 0.5;
				}
				animObj.framesData.push({
					x:frameData.frame.x,
					y:frameData.frame.y,
					w:frameData.frame.w,
					h:frameData.frame.h,
					rotated:frameData.rotated,
					rotation: (frameData.rotated) ? 90 : 0,
					cx:cx,
					cy:cy
				});
			}
			animObj.loaded = true;
			this.animations[animObj.name] = animObj;
		}
	}
};