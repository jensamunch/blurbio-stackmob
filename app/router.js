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
			blurbmodel.set(blurbmodel.defaults);
		blurbmodel.set({ blurbschema_id : makeid() });
		appview.shownew();
	},
	
	blurbview: function(blurbid) {		
		//start spinner
		$("#spinner").show();
		spinner.spin(spinnertarget);

		blurbmodel.set({
			blurbschema_id: blurbid
		});
		
		blurbmodel.fetch({
			success: function(model) {
				spinner.stop();
				$("#spinner").hide();
				appview.showblurb();
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
	currentpage = '';
	blurbmodel = new App.Blurbmodel();
	imagecollection = new App.Imagecollection();

	//create all the views
	appview = new App.Appview();
	headerview = new App.Headerview({ model : blurbmodel })
	urlview = new App.Urlview({ model : blurbmodel });
	dropzoneview = new App.Dropzoneview();
	imagesview = new App.Imagesview({ collection : imagecollection});
	textview = new App.Textview({ model : blurbmodel });
	texteditview = new App.Texteditview({ model : blurbmodel });
	
	//instantiate spinner
	spinner = new Spinner(spinopts)
	spinnertarget = document.getElementById('spinner');
	
	app = new App.Router();
	Backbone.history.start();

})

