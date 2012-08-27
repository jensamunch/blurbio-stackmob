var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {
		':blurbid': 'blurbview',
		'new/' :	'newview',
		''	:	'homeview',
	},
	
	initialize: function(options) {
    },
  
	homeview: function() {		
		//which blurb is the homepage - go there
		
		var homepage = 'blurbio';
		app.navigate(homepage, {trigger: false});
		this.blurbview(homepage);
		
	},
	
	newview: function() {		
		//reset imagecollection to avoid showing
		imagecollection.reset();
		$('#tweets').hide();
				
		$(".navigate").html('> > > >')
		$(".navigate").attr("id","create");
		
		//get new ID which is not in use
		
		do
		  {
			  newid = makeid();
			  blurbmodel.set({ blurbschema_id : newid })
				  blurbmodel.fetch({
					success: function(model) {newid = 'duplicate';}	
					})
		  }
		while (newid == 'duplicate')	  

		newview = new App.Newview({model : blurbmodel});
		appview.showmain(newview);		
		
	},
	
	blurbview: function(blurbid) {		
		//start spinner
		$("#spinner").show();
		var target = document.getElementById('spinner');
		var spinner = new Spinner(spinopts).spin(target);
		
		blurbmodel.set({
			blurbschema_id: blurbid
		});
		
		blurbmodel.fetch({
			success: function(model) {
				//load images
				$(".navigate").html('blurb.io')
				$(".navigate").attr("id","new");
				
				images = model.get('images');
	
				for (var m = 0; images[m]; m++) {
					imagecollection.add({ data : images[m] })				
					}
				
				blurbview = new App.Blurbview({
					model: blurbmodel
				})
				spinner.stop();
				$("#spinner").hide();
				appview.showmain(blurbview);
				},
			error: function(model) {
				spinner.stop();
				$("#spinner").hide();
				app.navigate('#home');
				},
		});
		
    },
    
})
$(function() {
	//create all the models and variables i want to be global and reuse
	appview = new App.Appview();
	blurbmodel = new App.Blurbmodel();
	
	imagecollection = new App.Imagecollection();

	headerview = new App.Headerview()
	imagesview = new App.Imagesview({ collection : imagecollection});
	
	app = new App.Router();
	Backbone.history.start();

})

