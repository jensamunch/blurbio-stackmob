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
