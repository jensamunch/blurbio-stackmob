var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {
		':blurbid': 'blurbview',
		'new/' :	'newview',
		''	:	'homeview',
	},
	
	initialize: function(options) {
		console.log('router')
		appview = new App.Appview();
		
		appmodel = new App.Appmodel();
		headerview = new App.Headerview({model : appmodel});
    },

	homeview: function() {
		console.log('router home')
		homeview = new App.Homeview();
		appview.showmain(homeview);
	},
	
	newview: function() {
		console.log('router new')
		imagecollection = new App.Imagecollection()
		blurbmodel = new App.Blurbmodel()
		
		newview = new App.Newview({model : blurbmodel});
		imageview = new App.Imageview({collection : imagecollection});
		
		appview.showimage(imageview);
		appview.showmain(newview);
	},
	
	blurbview: function(blurbid) {
		console.log('router blurbview')
		blurbmodel = new App.Blurbmodel();
		blurbmodel.set({
			blurbschema_id: blurbid
		});
		
		blurbmodel.fetch({
			success: function(model) {
				//After StackMob returns print out the result
			blurbview = new App.Blurbview({
				model: blurbmodel
			})
			imageview = new App.Imageview({collection : imagecollection});
			
			appview.showimage(imageview);
			appview.showmain(blurbview);
		}
		});
		
    },
    
})
$(function() {
	app = new App.Router();
	Backbone.history.start();
})

