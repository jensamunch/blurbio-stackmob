var App = App || {};
"use strict";



App.Newview = Backbone.View.extend({
	el: '#main',
	tpl: _.template($("#newviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	initialize: function() {
		_.bindAll(this);
		images = [];
		postmodel = new App.Blurbmodel();
		postmodel;
		postmodel.set({
			blurbschema_id: makeid()
		});
		this.render();
	},
	events: {
		'click .btn#render': 'rendercarousel',
		'click .btn#create': 'createblurb',
		'click #new': 'new',
		'change input#files': 'fileselect',
	},
	render: function() {
		that = this
		console.log('newview - render')
		html = this.tpl(postmodel.toJSON())
		this.$el.html(html);
	},
				
		
		new: function() {
		
		console.log('new blurb')
		var newview = new App.Newview();

		
		
		
	},
	
	rendercarousel: function() {
		that = this;
		$('#carousel').empty();
		for (var m = 0; m < images.length; m++) {
			image = images[0];
			html = that.imagetpl({
				data: image
			})
			$('#carousel').append(html);
		}		
	},
	
	createblurb: function() {
		var target = document.getElementById('main');
		var spinner = new Spinner(opts).spin(target);
		console.log('create and show blurb');
		//first set title and images[]
		console.log('title being saved is - ' + $('#title').val())
		postmodel.set({
			title: $('#title').val(),
			images: images,
		})
		postmodel.create({
			success: function(model) {
				console.debug('saved as - ' + model);
				spinner.stop();
				var blurbview = new App.Blurbview({
					model: postmodel
				});
				app.navigate(postmodel.get('blurbschema_id'), {
					trigger: false,
					replace: false
				});
			},
			error: function(model) {
				console.debug('not saved - why oh why')
				console.log('go home');
				app.navigate('/', {
					trigger: true
				});

			}
		});
	},
	fileselect: function(evt) {
		//empty array
		images = [];
		var files = evt.target.files; // FileList object
		//only allow 3 images
		for (var i = 0, f; f = files[i]; i++) {
			if (i > 2) return;
			//can be found in utils
			setimages(f);
		}
		//they're all in = now trigger rendercaorousel
		console.log('theyre all in - rendering new images');
		//for some reason it all breaks when this line is active
		//that.rendercarousel();
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
		'click .btn#new': 'new',
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
		app.navigate('/', {	trigger: true });

		
	},
	
	rendercarousel: function() {
		that = this;
		for (var m = 0; m < images.length; m++) {
			image = images[0];
			html = that.imagetpl({
				data: image
			})
			$('#carousel').append(html);
		}
	}
});