var App = App || {};
"use strict";

App.Appmodel = Backbone.Model.extend({
	defaults: {
		page: 'home',
		button: '> > > >',
	}
});

App.Blurbmodel = StackMob.Model.extend({
	schemaName: 'blurbschema',
});

App.Imagemodel = Backbone.Model.extend({
	defaults: {
		data: '',
	}
});

App.Imagecollection = Backbone.Collection.extend({
	model: App.Imagemodel,
});


blurbmodel = new App.Blurbmodel();
appmodel = new App.Appmodel();
imagecollection = new App.Imagecollection();