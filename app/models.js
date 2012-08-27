var App = App || {};
"use strict";

App.Appmodel = Backbone.Model.extend({
});

App.Blurbmodel = StackMob.Model.extend({
	
	schemaName: 'blurbschema',
	
	defaults: {
	},
	
	setexpiry: function(days) {
		var nowdate=new Date();
		var expirydate = nowdate.setDate(nowdate.getDate()+days)
		console.log(expirydate)
		this.set({ expirydate : expirydate })
	},
});

App.Imagemodel = Backbone.Model.extend({});

App.Imagecollection = Backbone.Collection.extend({
	model: App.Imagemodel,
})
