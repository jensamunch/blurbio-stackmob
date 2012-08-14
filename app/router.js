var App = App || {};
"use strict";
App.Router = Backbone.Router.extend({
	routes: {
		'new/': 'newview',
		':blurbid': 'blurbview',
		'': 'home',
	},
	initialize: function() {
	console.log('router')
		
	},
	home: function() {
		var homeview = new App.Homeview()
	},
	newview: function() {
		
		var newview = new App.Newview({
			model: blurbmodel
		});
	},
	
	blurbview: function(blurbid) {
		
		blurbmodel = new App.Blurbmodel();

		blurbmodel.set({
			uid: blurbid
		});
		
		blurbmodel.fetch({
		      success: function(model) {
	        //After StackMob returns "Bill Watterson", print out the result
	        console.debug('success of fetch - title & uid: ' + blurbmodel.get('title') + ': ' + blurbmodel.get('uid'));
	        console.log(JSON.stringify(model));
	        console.log(JSON.stringify(blurbmodel));
	        blurbview = new App.Blurbview({	model: model })
	        }
        });
		
	        

	    
	}
})
$(function() {
	app = new App.Router();
	Backbone.history.start();
})