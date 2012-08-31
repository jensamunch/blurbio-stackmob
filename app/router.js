var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {
		':blurbid': 'blurbview',
		'new/' :	'newview',
		'admin/' : 'adminview',
		''	:	'homeview',
	},
	
	initialize: function(options) {
    },
  
	adminview: function() {		
		console.log('router adminview')
		appview.showadmin();
	},
	
	homeview: function() {		
		console.log('router homeview')
		//which blurb is the homepage - go there
		app.navigate(homepage, {trigger: false});
		this.blurbview(homepage);		
	},
	
	newview: function() {		
		console.log('router newview')
		blurbmodel.set(blurbmodel.defaults);
		blurbmodel.set({ blurbschema_id : makeid() });
		appview.shownew();
	},
	
	blurbview: function(blurbid) {		
		console.log('router blurbview')
		
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
				blurbmodel.getimages();
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
	homepage = 'blurbio';
	blurbmodel = new App.Blurbmodel();
	blurbcollection = new App.Blurbcollection();
	imagecollection = new App.Imagecollection();
	usermodel = new App.Usermodel()

	//create all the views
	appview = new App.Appview();
	headerview = new App.Headerview({ model : blurbmodel })
	urlview = new App.Urlview({ model : blurbmodel });
	dropzoneview = new App.Dropzoneview();
	imagesview = new App.Imagesview({ collection : imagecollection});
	textview = new App.Textview({ model : blurbmodel });
	texteditview = new App.Texteditview({ model : blurbmodel });
	adminview = new App.Adminview({ model : usermodel })
	
	//instantiate spinner
	spinner = new Spinner(spinopts)
	spinnertarget = document.getElementById('spinner');
	
	app = new App.Router();
	Backbone.history.start();
})

