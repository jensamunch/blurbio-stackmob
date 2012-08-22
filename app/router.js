var App = App || {};
"use strict";

App.Router = Backbone.Router.extend({
	routes: {
		':blurbid': 'blurbview',
		'new/' :	'newview',
		''	:	'homeview',
	},
	
	initialize: function(options) {
		console.log('router init');
    },

	homeview: function() {
		console.log('router home')
		
		appmodel.set({page : 'home'});
		appmodel.set({button : '> > > >'});
		
		headerview = new App.Headerview({model : appmodel})
		appview.showheader(headerview);
		
		homeview = new App.Homeview();
		appview.showmain(homeview);
		
		appview.showimage('none');
	},
	
	newview: function() {
		console.log('router new')
		
		appmodel.set({page : 'new'});
		appmodel.set({button : '> > > >'});
		
		headerview = new App.Headerview({model : appmodel});
		appview.showheader(headerview);
		
		blurbmodel = new App.Blurbmodel()
		newview = new App.Newview({model : blurbmodel});
		appview.showmain(newview);
		
		imageview = new App.Imageview();
		
		
	},
	
	blurbview: function(blurbid) {
		console.log('router blurbview')
		
		appmodel.set({page : 'blurb'});
		appmodel.set({button : 'blurb.io'});
		
		headerview = new App.Headerview({model : appmodel});
		appview.showheader(headerview);
		
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
			imageview = new App.Imageview();
			
			appview.showimage(imageview);
			appview.showmain(blurbview);
		}
		});
		
    },
    
})
$(function() {
	appview = new App.Appview()
	
	app = new App.Router();
	Backbone.history.start();

})

