var App = App || {};
"use strict";

App.Blurbmodel = StackMob.Model.extend({
	
	schemaName: 'blurbschema',
	
	defaults: {
		blurbschema_id: '',
		images: [],
		blurbtext: '',
		expirydate: 0,
	},
	
	setexpiry: function(days) {
		var nowdate=new Date();
		var expirydate = nowdate.setDate(nowdate.getDate()+days)
		this.set({ expirydate : expirydate })
	},
	
	setimages: function() {
		images = []
		images.length = 0
		imagecollection.each( function(item) {
			images.push(item.get('data'))		
		})
		this.set({images : images});
	},
	
	getimages: function() {
		images = this.get('images');
		for (var m = 0; images[m]; m++) {
					imagecollection.add({ data : images[m] })				
				}	
	},
	
	
});

App.Imagemodel = Backbone.Model.extend({});

App.Imagecollection = Backbone.Collection.extend({
	model: App.Imagemodel,
})
