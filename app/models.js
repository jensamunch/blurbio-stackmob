var App = App || {};
"use strict";

App.Appmodel = Backbone.Model.extend({
});

App.Blurbmodel = StackMob.Model.extend({
	
	schemaName: 'blurbschema',
	
	defaults: {
	},
	
	setexpiry: function(days) {
		var myDate=new Date();
		this.set({ expiry : myDate.setDate(myDate.getDate()+days) })
	},
});

App.Imagemodel = Backbone.Model.extend({});

App.Imagecollection = Backbone.Collection.extend({
	model: App.Imagemodel,
})
