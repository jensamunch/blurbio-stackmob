var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {
		':blurbid': 'blurbview',
		''	:	'homeview',
	},
	
	initialize: function(options) {
	console.log('render')
    },

	homeview: function() {
		console.log('render home')
		homeview = new App.Homeview();	
		appview.showview(homeview);
	},
	
	blurbview: function(blurbid) {
		console.log('render blurbview')
		blurbmodel = new App.Blurbmodel();
		blurbmodel.set({
			blurbschema_id: blurbid
		});
		
		blurbmodel.fetch({
			success: function(model) {
				//After StackMob returns print out the result
			blurbview = new App.Blurbview({
				model: model
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

