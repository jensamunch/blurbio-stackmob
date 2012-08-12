var App = App || {};
"use strict";

App.Blurbmodel = StackMob.Model.extend({
	
	schemaName	:	'blurb2',
		
	setimage: function(f,i) {
		var reader = new FileReader();
		that=this;
		// Closure to capture the file information
		reader.onload = (function(f) {
			console.log(i)
			return function(e) {
				var filename = f.name;
				var filetype = f.type;
				//that.set({data : e.target.result});
				var base64 = e.target.result.substring(e.target.result.indexOf(',') + 1, e.target.result.length);
				that.setBinaryFile('photo'+i, filename, filetype, base64);
				console.log('photo'+ '...' + i + '...' + filename + filetype);
				}
			}) (f);
		// Read in the file as a data URL
		
		reader.readAsDataURL(f);
		that.save();
		},
		
		
})


App.Blurbimage = Backbone.Model.extend({
	
	defaults: {
        },
        
        initialize: function(){	
	    f = this.get('f');
		console.log(f);
		
		var img = new Image();
// added cause it wasnt defined
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");
var canvasCopy = document.createElement("canvas");
// adding it to the body

document.body.appendChild(canvasCopy);

var copyContext = canvasCopy.getContext("2d");


		
		var reader = new FileReader();
		that=this;
		
		// Closure to capture the file information
		reader.onload = (function(f) {
			return function(e) {
				that.set({filename : f.name});
				that.set({filetype : f.type});
				//that.set({data : e.target.result})
				//blurbimages.add(that)
				}
			}) (f);
			
				reader.onloadend = function(e) {
		
			    var img = new Image();
			    var ctx = canvas.getContext("2d");
			    var canvasCopy = document.createElement("canvas");
			    var copyContext = canvasCopy.getContext("2d");
			    var maxWidth = 300;
			    var maxHeight = 300;
			    
			    img.onload = function()
			    {
			        var ratio = 1;
			
			        if(img.width > maxWidth)
			            ratio = maxWidth / img.width;
			        else if(img.height > maxHeight)
			            ratio = maxHeight / img.height;
			
			        canvasCopy.width = img.width;
			        canvasCopy.height = img.height;
			        copyContext.drawImage(img, 0, 0);
			
			        canvas.width = img.width * ratio;
			        canvas.height = img.height * ratio;
			        ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
			    };
		
			    img.src = reader.result;
		}
		// Read in the file as a data URL
		reader.readAsDataURL(f);
		},        
    
})

App.Blurbimages = Backbone.Collection.extend({    
        model: App.Blurbimage
    });



//var Blurbimage = App.Blurbimage;

// blurbimages = new App.Blurbimages;

//instantiate collection for images
//var blurbimages

		