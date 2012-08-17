var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {
		':blurbid': 'blurbview',
		'new/': 'postview',
		''	:	'homeview',
	},
	
	initialize: function(options) {
    },

	homeview: function() {
		homeview = new App.Homeview();	
		appview.showview(homeview);
	},
  
	postview: function() {
		blurbmodel = new App.Blurbmodel();
		postview = new App.Postview({model : blurbmodel});
		appview.showview(postview);
	},
	
	
	blurbview: function(blurbid) {
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

