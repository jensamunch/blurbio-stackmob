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
		//reset imagecollection to avoid showing
		imagecollection.reset();
		$('#tweets').hide();
				
		appmodel.set({page : 'home'});
		$(".navigate").html('New');
		$(".navigate").attr("id","new");
				
		homeview = new App.Homeview();
		appview.showmain(homeview);	
		
	},
	
	newview: function() {		
		//reset imagecollection to avoid showing
		imagecollection.reset();
		$('#tweets').hide();
				
		appmodel.set({page : 'new'});
		$(".navigate").html('Create')
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
		appmodel.set({page : 'blurb'});
		$(".navigate").html('Home')
		$(".navigate").attr("id","home");
		
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
				app.navigate('');
				},
		});
		
    },
    
})
$(function() {
	//create all the models and variables i want to be global and reuse
	
	appview = new App.Appview();
	blurbmodel = new App.Blurbmodel();
	
	//this one will hold the images array
	images = [];
	imagecollection = new App.Imagecollection();

	appmodel = new App.Appmodel();
	headerview = new App.Headerview({model : appmodel})
	
	imagesview = new App.Imagesview({ model : blurbmodel, collection : imagecollection});
	
	app = new App.Router();
	Backbone.history.start();

})

