var App = App || {};
"use strict";

App.Usermodel = StackMob.User.extend({
	schemaName: 'userschema',
})

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
		this.set({ expirydate : expirydate.valueOf() })
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

App.Blurbcollection = StackMob.Collection.extend({
	model: App.Blurbmodel,
})

App.Imagemodel = Backbone.Model.extend({});

App.Imagecollection = Backbone.Collection.extend({
	model: App.Imagemodel,
})
