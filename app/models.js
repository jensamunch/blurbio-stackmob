var App = App || {};
"use strict";

App.Appmodel = Backbone.Model.extend({
});

App.Blurbmodel = StackMob.Model.extend({
	schemaName: 'blurbschema',
	
	defaults: {
		viewcount: 0,	
	},
	
	triggerimages: function() {
		this.trigger("change:images");
		}
});

App.Imagemodel = Backbone.Model.extend({});

App.Imagecollection = Backbone.Collection.extend({
	model: App.Imagemodel,
})
