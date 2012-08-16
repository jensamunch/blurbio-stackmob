var App = App || {};
"use strict";



App.Postview = Backbone.View.extend({
	el: '#main',
	tpl: _.template($("#newviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	initialize: function() {
		_.bindAll(this);
		var files = [];
		var images = [];

		blurbmodel = new App.Blurbmodel();
		this.model = blurbmodel;
		this.model.set({
			blurbschema_id: makeid()
		});
		this.render();
		
	},
	events: {
		'click .button#create': 'createblurb',
		'change #inputfiles' : 'selectfiles',
	},
	render: function() {
		that = this
		html = this.tpl(this.model.toJSON())
		this.$el.html(html);
	},
	
	selectfiles: function(evt) {
	files = evt.target.files;
	images = [];
	if (files) {
			if ($('#size').val() == 'phone') {
				var w=300, h = 200;
			}
			else {
				var w=600, h = 400;
			}
			
			for (var m = 0, f; f = files[m]; m++) {
				setimages(f, w, h);
				}
		}
	},	
	
	createblurb: function() {		
		app.navigate(this.model.get('blurbschema_id'));
		//deactivate button
		that = this;
		
		if (images) {
			
						//start spinner		
						var target = document.getElementById('main');
						var spinner = new Spinner(opts).spin(target);
						
						this.model.set({
								title: $('#title').val(),
								images : images,
							})
							
						console.log('create and show blurb');
						this.model.create({
							success: function(model) {
								spinner.stop();
								var blurbview = new App.Blurbview({
									model: model
									});
								},
							error: function(model) {
								console.debug('not saved - why oh why')
								console.log('go home');
								app.navigate('', {
									trigger: true
								});
				
							}
						});
			}
	},
	

})
App.Blurbview = Backbone.View.extend({
	el: '#main',
	tpl: _.template($("#blurbviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	
	initialize: function() {
		_.bindAll(this);
		that = this;
		console.log('model inside blurbview is = ' + this.model.get('blurbschema_id'));
		this.render();
	},
	
	events: {
		'click .button#new': 'new',
	},
	
	
	render: function() {
		console.log('blurbview - render')
		html = this.tpl(this.model.toJSON());
		$(this.el).html(html)
		//render images if there are any - if not try to get them
		images = this.model.get('images');
		
		if (images[0]) {
			this.rendercarousel(images);
		}
	},
	
	new: function() {
		app.navigate('', {	trigger: true });

		
	},
	
	rendercarousel: function() {
		that = this;
		$('#images').empty();
		
		for (var m = 0; m < images.length; m++) {
			html = that.imagetpl({
				data: images[m]
			})
			$('#images').append(html);
		}		
	},
});