var App = App || {};
"use strict";

App.Appmodel = Backbone.Model.extend({
});

App.Blurbmodel = StackMob.Model.extend({
	schemaName: 'blurbschema',
	
	triggerimages: function() {
		this.trigger("change:images");
		}
});
