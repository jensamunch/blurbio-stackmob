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
    },

	homeview: function() {
		console.log('router home')
		homeview = new App.Homeview();	
		appview.showview(homeview);
	},
	
	newview: function() {
		console.log('router new')
		blurbmodel = new App.Blurbmodel();
		postview = new App.Postview({
			model: blurbmodel
		});
		appview.showview(postview);
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
			appview.showview(blurbview);
		}
		});
		
    },
    
})
$(function() {
	appview = new App.Appview();
	app = new App.Router();
	Backbone.history.start();
})

