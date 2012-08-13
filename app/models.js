var App = App || {};
"use strict";



App.Blurbmodel = StackMob.Model.extend({
	schemaName: 'blurbschema',
	
	defaults: {
		title: '',
		photos: [],
	},
	
	setimages: function(f) {
		var ratio = 1;
		// defining cause it wasnt
		var maxWidth = 600,
			maxHeight = 600;
		
		that = this;
		var base64resized;
		var reader = new FileReader();
		var img = new Image();
		
		reader.onload = (function(theFile) {
			return function(e) {
				
				//once base64 has been loaded into image we can start resizing
				img.onload = function() {
					
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					var canvasCopy = document.createElement("canvas");
					var copyContext = canvasCopy.getContext("2d");
					
					if (img.width > maxWidth) ratio = maxWidth / img.width;
					else if (img.height > maxHeight) ratio = maxHeight / img.height;
					canvasCopy.width = img.width;
					canvasCopy.height = img.height;
					copyContext.drawImage(img, 0, 0);
					canvas.width = img.width * ratio;
					canvas.height = img.height * ratio;
					ctx.drawImage(canvasCopy, 0, 0, canvas.width, canvas.height);
					
					//move canvas data back to DataURL Base64
					base64resized = canvas.toDataURL();
					
					//save base64 as array in this.model.photos[]
					a = that.get('photos');
					a.push(base64resized);
					that.set('photos', a); 
					
				};
				
				//load base64 into img
				img.src = e.target.result;
			}
		})(f);
			
		reader.readAsDataURL(f);
		return true;
	},
	
	
});