var App = App || {};
"use strict";
Backbone.View.prototype.close = function() {
	console.log('removing');
	this.remove();
	this.unbind();
	if (this.close) {
		this.close();
	}
}
App.Appview = Backbone.View.extend({
	showview: function(view) {
		if (this.currentview) {
			this.currentview.close();
		}
		this.currentview = view;
		this.currentview.render();
	}
});
App.Homeview = Backbone.View.extend({
	el: '#main',
	//tpl: _.template($("#homeviewtpl").html()),
	tpl: _.template($("#homeviewtpl").html()),
	initialize: function() {
		_.bindAll(this);
	},
	events: {
		'click .button#gocreate': 'gocreate',
	},
	gocreate: function() {
		blurbmodel = new App.Blurbmodel();
		postview = new App.Postview({
			model: blurbmodel
		});
		appview.showview(postview);
	},
	close: function() {},
	render: function() {
		html = this.tpl();
		this.$el.html(html);
	},
	postview: {}
})
App.Postview = Backbone.View.extend({
	el: '#main',
	tpl: _.template($("#newviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	initialize: function() {
		_.bindAll(this);
	},
	events: {
		'click .button#create': 'createblurb',
		'change #inputfiles': 'selectfiles',
	},
	close: function() {},
	render: function() {
		that = this
		images = [];
		html = this.tpl()
		this.$el.html(html);
		$('#redactor').redactor(textopts);
	},
	selectfiles: function(evt) {
		files = evt.target.files;
		images = [];
		if (files) {
			var w = 800;
			var h = 800;
			
			for (var m = 0, f; f = files[m]; m++) {
				if (!f.type.match('image.*')) {
						continue;
						}
				setimages(f, w, h);
			}
		}
	},
	createblurb: function() {
		//start spinner		
		var target = document.getElementById('main');
		var spinner = new Spinner(spinopts).spin(target);
		that = this;
		this.model.set({
			blurbschema_id: makeid(),
			title: $('#redactor').val(),
		})
		if (typeof images != 'undefined') {
			this.model.set({
				images: images,
			})
		}
		this.model.create({
			success: function(model) {
				spinner.stop();
				blurbview = new App.Blurbview({
					model: model
				});
				blurbview = new App.Blurbview({
					model: model
				})
				appview.showview(blurbview);
			},
			error: function(model, response) {
				console.debug('not saved' + response)
				return false;
			},
		});
		app.navigate(this.model.get('blurbschema_id'), {
			trigger: false
		});
	},
})
App.Blurbview = Backbone.View.extend({
	el: '#main',
	tpl: _.template($("#blurbviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	initialize: function() {
		_.bindAll(this);
	},
	events: {
		'click .button#gocreate': 'gocreate',
		'click .share#mail': 'mail',
		'click .share#twitter': 'twitter',
	},
	close: function() {},
	render: function() {
		var str = this.model.get('title');
		var div = document.createElement("div");
		div.innerHTML = str;
		var text = div.textContent || div.innerText || "";
		document.title = text.substring(0, 40) + '...';
		var url = Backbone.history.getFragment();
		_gaq.push(['_trackPageview', "/#" + url]);
		html = this.tpl(this.model.toJSON());
		$(this.el).html(html)
		//show tweets
		gettweets('#' + this.model.get('blurbschema_id'));
		//render images if there are any - if not try to get them
		images = this.model.get('images');
		if (typeof images != 'undefined') {
			this.renderimages(images);
		}
	},
	gocreate: function() {
		blurbmodel = new App.Blurbmodel();
		postview = new App.Postview({
			model: blurbmodel
		});
		app.navigate('', {
			trigger: false,
			replace: true
		});
		appview.showview(postview);
	},
	mail: function() {
		var subject = document.title;
		var body = "\r\n";
		body += 'Here\'s something I wanted to share - ' + document.location;
		var uri = "mailto:?subject=";
		uri += encodeURIComponent(subject);
		uri += "&body=";
		uri += encodeURIComponent(body);
		window.open(uri);
	},
	twitter: function() {
		var hashtag = this.model.get('blurbschema_id');
		var twtTitle = document.title;
		var twtUrl = location.href;
		var twtLink = 'http://twitter.com/home?status=' + encodeURIComponent(twtTitle + ' ' + twtUrl + ' #' + hashtag);
		window.open(twtLink);
	},
	renderimages: function() {
		that = this;
		for (var m = 0; m < images.length; m++) {
			html = that.imagetpl({
				data: images[m]
			})
			$('.images').append(html);
		}
	},
});