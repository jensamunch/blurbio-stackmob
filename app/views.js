
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
	
	tpl: _.template($("#newviewtpl").html()),
	
	carouseltpl: _.template($("#carouseltpl").html()),
	
	initialize: function() {
		_.bindAll(this);
		this.render();
		//use trigger to start this
		this.model.on('change:photos', this.rendercarousel);



	},
	
	events: {
		'click .btn' : 'rendercarousel',
		//'click .carousel-control-left' : 'carouselleft',
		//'click .carousel-control-right' : 'carouselright',
		//"change input": "fieldchanged",
		//'change select' : "selectionchanged",
		'change input#files' : 'fileselect',
	},
	
	
	render: function() {
		console.log('newview - Render')
		this.$el.html(this.tpl());
		
	},
	
	rendercarousel: function() {
		//later this will be saved when the whole thing saves
		
		that = this;
		// loop through an array with the image URLs
		console.log('render carousel');
		photos = this.model.get('photos')
		
		//reset div
		$('#add').html('');
		
		for (var m=0; m<photos.length; m++) {	
			html = that.carouseltpl({data : photos[m]});
			$('#add').append(html);
			}		
		console.log(this.model);
		this.model.save();
      },


	
	createblurb: function() {
		that = this;
		console.log('Ready to create and show Blurb');

		
	},

		
	
	
	fieldchanged: function(e) {
		console.log('fieldchanged');
		

			
	},
	
	
	 
  
  fileselect: function(evt) {
	  console.log('fileselect');
	  var files = evt.target.files; // FileList object
	  
	  for (var i = 0, f; f = files[i]; i++) {
		  this.model.setimages(f);	    
		  }
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

