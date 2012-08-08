var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {
		''					: 'home',
		'edit/:blurbid'		: 'editview',
		'post/'				: 'postview',
		':blurbid'			: 'blurbview',

	},

	initialize: function() {
		console.log('Router Init')
		

	},

	home: function () {
		console.log('home')
		var blurb = new App.BlurbModel
		new App.HomeView({model : blurb})
	},
	
	postview: function() {
		console.log('postview')
		var blurbmodel = new App.BlurbModel
		new App.PostView({model : blurbmodel})
	},
	
	editview: function(blurbid) {
		console.log('editview')
		var blurbmodel = new App.BlurbModel
		new App.PostView({model : blurbmodel, blurbid : blurbid})
	},
	
	blurbview: function(blurbid) {
		console.log('blurbview')
		var blurbmodel = new App.BlurbModel
		var blurbview = new App.BlurbView({model : blurbmodel, blurbid : blurbid});
	}
	
})

$(function() { 
	new App.Router();	
	Backbone.history.start();
})



