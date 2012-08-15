var App = App || {};
"use strict";

makeid = function() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 4; i++)
	text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

var setimages = function(f) {
		var ratio = 1;
		// defining cause it wasnt
		var maxWidth = 300,
			maxHeight = 300;
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
					//save base64 as array images[]
					images.push(base64resized);
					

				};
				//load base64 into img
				img.src = e.target.result;
			}
		})(f);
		reader.readAsDataURL(f);
	}
	
	
var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 10, // The line thickness
  radius: 40, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  color: '#000', // #rgb or #rrggbb
  speed: 0.5, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
