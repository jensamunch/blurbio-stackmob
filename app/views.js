var App = App || {};
"use strict";

App.HomeView = Backbone.View.extend({
	el: '#main',
	
	initialize: function () {
		this.render()	
	},
	
	render: function () {
		console.log('HomeView - Render')
        $(this.el).html(this.template(this.model.toJSON()))
        return this;
    }
	
})




App.PostView = Backbone.View.extend({
	el: '#main',
	
	initialize: function () {
		this.render();

	},
	
	events: function() {
	//'click a' : 'ShowBlurb',
	},
	
	render: function () {
		console.log('PostView - Render')
		$(this.el).html(this.template(this.model.toJSON()))		
    },
    
    ShowBlurb: function() {
    console.log('Ready to create and show Blurb')
    }
    

})

App.BlurbView = Backbone.View.extend({
	el: '#main',	

	
	initialize: function () {
		this.render()
	},

	
	render: function () {
		console.log('BlurbView - Render');
		$(this.el).html(this.template(this.model.toJSON()))
		return this
    }
	
})




