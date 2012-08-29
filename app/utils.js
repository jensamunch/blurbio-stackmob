var App = App || {};
"use strict";

makeid = function() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 6; i++)
	text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

addimage = function(f,m) {
		//this is where the resizing comes in
		var ratio = 1;
		var maxWidth = 500;
		var maxHeight = 500;
		var quality = 0.8
		
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
					if (img.width > img.height) {
						if (img.width > maxWidth) ratio = maxWidth / img.width;
					} else {
						if (img.height > maxHeight) ratio = maxHeight / img.height;
					}
					canvasCopy.width = img.width;
					canvasCopy.height = img.height;
					copyContext.drawImage(img, 0, 0);
					canvas.width = img.width * ratio;
					canvas.height = img.height * ratio;
					ctx.drawImage(canvasCopy, 0, 0, canvas.width, canvas.height);
					//move canvas data back to DataURL Base64 - choose quality
					base64resized = canvas.toDataURL("image/jpeg", quality);

					//push to collection
					imagecollection.add({data : base64resized});
					
				};
				//load base64 into img
				img.src = e.target.result;
			}
		})(f);
		reader.readAsDataURL(f);
	},

redactoropts = {

buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', '|', 'link', '|',
				'fontcolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'justify'],
}				

spinopts = {
	lines: 10,
	// The number of lines to draw
	length: 50,
	// The length of each line
	width: 15,
	// The line thickness
	radius: 50,
	// The radius of the inner circle
	corners: 1,
	// Corner roundness (0..1)
	rotate: 0,
	// The rotation offset
	color: '#e20000',
	// #rgb or #rrggbb
	speed: 1,
	// Rounds per second
	trail: 60,
	// Afterglow percentage
	shadow: false,
	// Whether to render a shadow
	hwaccel: false,
	// Whether to use hardware acceleration
	className: 'spinner',
	// The CSS class to assign to the spinner
	zIndex: 2e9,
	// The z-index (defaults to 2000000000)
	top: 'auto',
	// Top position relative to parent in px
	left: 'auto' // Left position relative to parent in px
};


textopts = {
	keyupCallback: false,
	// function
	keydownCallback: false,
	// function
	execCommandCallback: false,
	// function
	focus: false,
	autoresize: true,
	fixed: false,
	source: true,
	mobile: true,
	air: false,
	wym: false,
	convertLinks: true,
	convertDivs: false,
	autosave: false,
	// false or url
	interval: 60,
	// seconds
	imageGetJson: false,
	// url (ex. /folder/images.json ) or false
	imageUpload: false,
	// url
	imageUploadCallback: false,
	// function
	fileUpload: false,
	// url
	fileUploadCallback: false,
	// function
	uploadCrossDomain: false,
	uploadFields: false,
	observeImages: true,
	overlay: true,
	// modal overlay
}