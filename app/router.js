var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {
		':blurbid': 'blurbview',
		'': 'postview',
	},
	
	initialize: function() {
	},

  
	postview: function() {
		var postview = new App.Postview();
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
		}
		});
}
})
$(function() {
	app = new App.Router();
	Backbone.history.start();
})

