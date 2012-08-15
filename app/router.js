var App = App || {};
"use strict";
App.Router = Backbone.Router.extend({
	routes: {
		':blurbid': 'blurbview',
		'': 'newview',
	},
	initialize: function() {
		console.log('router')
	},

	newview: function() {
		var newview = new App.Newview();
	},
	
	
	blurbview: function(blurbid) {
		blurbmodel = new App.Blurbmodel();
		blurbmodel.set({
			blurbschema_id: blurbid
		});
		blurbmodel.fetch({
			success: function(model) {
				//After StackMob returns print out the result
				console.debug('success of fetch - title : ' + blurbmodel.get('title'));
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