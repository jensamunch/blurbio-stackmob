var App = App || {};
"use strict";
App.Blurbmodel2 = StackMob.Model.extend({
	schemaName: 'blurb2',
	setimage: function(f, i) {
		var reader = new FileReader();
		that = this;
		// Closure to capture the file information
		reader.onload = (function(f) {
			console.log(i)
			return function(e) {
				var filename = f.name;
				var filetype = f.type;
				//that.set({data : e.target.result});
				var base64 = e.target.result.substring(e.target.result.indexOf(',') + 1, e.target.result.length);
				that.setBinaryFile('photo' + i, filename, filetype, base64);
				console.log('photo' + '...' + i + '...' + filename + filetype);
			}
		})(f);
		// Read in the file as a data URL
		reader.readAsDataURL(f);
	},
})
//save images as base64 code in array of strings
App.Blurbmodel = StackMob.Model.extend({
	schemaName: 'blurbschema',
	
	defaults: {
		title: '',
		photos: [],
	},
	
	setimages: function(f) {
		that = this;
		var base64resized;
		var reader = new FileReader();
		var img = new Image();
		// added cause it wasnt defined
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var canvasCopy = document.createElement("canvas");
		// adding it to the body
		var copyContext = canvasCopy.getContext("2d");
		reader.onload = (function(theFile) {
			return function(e) {
				img.onload = function() {
					var ratio = 1;
					// defining cause it wasnt
					var maxWidth = 100,
						maxHeight = 100;
					if (img.width > maxWidth) ratio = maxWidth / img.width;
					else if (img.height > maxHeight) ratio = maxHeight / img.height;
					canvasCopy.width = img.width;
					canvasCopy.height = img.height;
					copyContext.drawImage(img, 0, 0);
					canvas.width = img.width * ratio;
					canvas.height = img.height * ratio;
					ctx.drawImage(canvasCopy, 0, 0, canvas.width, canvas.height);
					base64resized = canvas.toDataURL();
					
					//console.log(base64resized);

					a = that.get('photos');
					a.push(base64resized);
					that.set('photos', a); 
					
				};
				img.src = e.target.result;
			}
		})(f);
		reader.readAsDataURL(f);
	},
});