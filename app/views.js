var App = App || {};
"use strict";

//JSON.stringify
//toJSON
//console.log(this.template());

App.Homeview = Backbone.View.extend({
	
	el: '#main',
	
	template: _.template($("#homeviewtpl").html()),
	
	initialize: function () {
		this.render()	
	},
	
	render: function () {
		console.log('homeView - Render')
		
        $(this.el).html(this.template())
    }
	
})



App.Newview = Backbone.View.extend({
	
	el: '#main',
	
	
	template: _.template($("#newviewtpl").html()),
	
	
	initialize: function () {
		console.log('init');
		_.bindAll(this, 'render');
		this.render();
	},
	
	events: function() {
	//'click a' : 'ShowBlurb',
	},
	
	render: function () {
		console.log('newview - Render')		
		$(this.el).html(this.template())		
    },
    
    
    ShowBlurb: function() {
    console.log('Ready to create and show Blurb')
    }
    

})




App.Blurbview = Backbone.View.extend({

	el: '#main',	

	
	template: _.template($("#blurbviewtpl").html()),
		
	initialize: function () {
		this.render()
	},

	
	render: function () {
		console.log('blurbview - Render')
		$(this.el).html(this.template())
    }
	
})








