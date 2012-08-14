var App = App || {};
"use strict";


App.Homeview = Backbone.View.extend({
	el: '#main',
	template: _.template($("#homeviewtpl").html()),
	initialize: function() {
		$('#main').empty();
		this.render()
	},
	render: function() {
		console.log('homeView - render')
		$(this.el).append(this.template())
	}
})


App.Newview = Backbone.View.extend({
	el: '#main',
	tpl: _.template($("#newviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	initialize: function() {
		_.bindAll(this);
		$('#main').empty();
		images = [];
		this.render();

	},
	events: {
		'click .btn#render': 'rendercarousel',
		'click .btn#create': 'createblurb',
		'change input#files': 'fileselect',
	},
	render: function() {
		that = this
		console.log('newview - render')
		html = this.tpl(that.model.toJSON())
		this.$el.append(html);
	},
	rendercarousel: function() {
		that = this;
		//reset div
		$('.images').empty();
		for (var m = 0; m < images.length; m++) {
			console.log('render ' + m);
			html = that.imagetpl({
				data: images[m]
			});
			$('.images').append(html);
		}

	},
	createblurb: function() {
		that = this
		console.log('create and show blurb');
		
		//first set title and images[]
		console.log('title being saved is' + $('#title').val() )
		this.model.set({
			title: $('#title').val(),
			images: images,
			})

		this.model.create({
			success: function(model) {
				console.debug('saved as - ' + model);
				that.unbind();
				var blurbview = new App.Blurbview({
				model: that.model
				});
				app.navigate(that.model.get('uid'), {trigger: false});
				
			},
			error: function(model) {
				console.debug('not saved - why oh why');
			}
			});
		},
		

	fileselect: function(evt) {
		//empty array
		images = [];
		
		var files = evt.target.files; // FileList object
		
		//only allow 5 images
		for (var i = 0, f; f = files[i]; i++) {
			if (i > 4) return;
			console.log(i);
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
		$('#main').empty();
		images = [];
		this.render()
		
	},
	render: function() {
		console.log('blurbview - render')
		console.log('this is the fetched object' + JSON.stringify(this.model));
		
		html = this.template(this.model.toJSON());
		if (!!html) { $(this.el).append(html) }
		
		//render images if there are any
		images = this.model.get('images');
		if (!!images) {console.log('we have images' + JSON.stringify(images)}
	}
	
	rendercarousel: function() {
		that = this;
		//reset div
		$('.images').empty();
		for (var m = 0; m < images.length; m++) {
			console.log('render ' + m);
			html = that.imagetpl({
				data: images[m]
			});
			$('.images').append(html);
		}
})