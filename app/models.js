var App = App || {};
"use strict";

App.Blurbmodel = StackMob.Model.extend({
	
	schemaName: 'blurbschema',
	
	defaults: {
		blurbschema_id: '',
		blurbtext: '',
		expirydate: 0,
	},
	
	setexpiry: function(days) {
		var nowdate=new Date();
		var expirydate = nowdate.setDate(nowdate.getDate()+days)
		this.set({ expirydate : expirydate })
	},
});

App.Imagemodel = Backbone.Model.extend({});

App.Imagecollection = Backbone.Collection.extend({
	model: App.Imagemodel,
})
