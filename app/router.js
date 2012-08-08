var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {

		''						: 'home',
		'new/'					: 'newview',
		':blurbid'				: 'blurbview',
		

	},

	initialize: function() {
		console.log('Router Init')
		

	},

	home: function () {
		console.log('-------')
		console.log('home')
		var homeview = new App.Homeview()
	},
	
	
	newview: function() {
		console.log('-------')
		console.log('newview')
		var blurbmodel = new App.Blurbmodel()
		var newview = new App.Newview()

	},
	
	blurbview: function(blurbid) {
		console.log('-------')
		console.log('blurbview for - ' + blurbid)
		var blurbmodel = new App.Blurbmodel()
		var blurbview = new App.Blurbview({model : blurbmodel, blurbid : blurbid});
	}
	
})

$(function() { 
	new App.Router();	
	Backbone.history.start();
})



