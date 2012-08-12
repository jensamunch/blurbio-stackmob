
var App = App || {};
"use strict";


//JSON.stringify
//toJSON
//console.log(this.template());

App.Homeview = Backbone.View.extend({
	el: '#main',
	template: _.template($("#homeviewtpl").html()),
	initialize: function() {
		this.render()
	},
	render: function() {
		console.log('homeView - Render')
		$(this.el).html(this.template())
	}
})



App.Newview = Backbone.View.extend({
	
	el: '#main',
	
	template: _.template($("#newviewtpl").html()),
	
	imagetpl: _.template($("#imagetpl").html()),
	
	initialize: function() {
		_.bindAll(this, 'createblurb');
		this.render();
		
		
		
	},
	
	events: {
		'click .btn' : 'createblurb',
		//"change input": "fieldchanged",
		//'change select' : "selectionchanged",
		'change input#files' : 'fileselect',
	},
	
	
	render: function() {
		console.log('newview - Render')
		this.$el.html(this.template())
		
	},
	
	rendercarousel: function() {
		
		// loop through an array with the image URLs
		console.log('render carousel');
		this.model.images.each(function(f){ 
			$(that.el).append(that.imagetemplate());	
		});
		
		$('.carousel').carousel();


	},
	
	createblurb: function() {
		that = this;
		console.log('Ready to create and show Blurb');
		
		//show all thumbnails below
		blurbimages.each(function(f) {
		
		var html = that.imagetpl({src : f.get('data')})
		console.log(f.get('filename'));
		that.$("#carouselitem").append(html)
		
          });

		
	
	},
	
	fieldchanged: function(e) {
		console.log('fieldchanged');
		var field = $(e.currentTarget);
		var data = {};
		data[field.attr('id')] = field.val();
		this.model.set(data);
	},
	
	selectionchanged: function() {
		console.log('selectchanged')	
	},
	
	 
  
  fileselect: function(evt) {
	  
	  var files = evt.target.files; // FileList object
	  
	  	//Set thumbnails in backbone model
	  	//for (var i = 0, f; f = files[i]; i++) {
	  	
		  	// Only process image files.
	      //if (f.type.match('image.*')) {
	      
	      //var blurbimage = new App.Blurbimage({ f : f})

	      //}
	  
	  //	}
	  
	  
	  // Loop through the FileList - Limit to 5 - and save them all in StackMob 
	    for (var i = 0; i<5; i++) {
	    	
	    	//upload each image - one by one..commented out for now
		    this.model.setimage(files[i],i); 
	    }
	    console.log('saving')
	    console.log(this.model)
	    this.model.save();
	    
  },
	
	


	
	
	
})
App.Blurbview = Backbone.View.extend({
	el: '#main',
	template: _.template($("#blurbviewtpl").html()),
	initialize: function() {
		this.render()
	},
	render: function() {
		console.log('blurbview - Render')
		$(this.el).html(this.template())
	}
})

