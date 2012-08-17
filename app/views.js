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
		this.render();
	},
	events: {
		'click .button#create': 'createblurb',
		'change #inputfiles': 'selectfiles',
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
				var w = 500,
					h = 500;
			} else {
				var w = 1000,
					h = 1000;
			}
			for (var m = 0, f; f = files[m]; m++) {
				setimages(f, w, h);
			}
		}
		//activate button
		$("button[type=submit]").removeAttr("disabled");
	},
	createblurb: function() {
		//start spinner		
		var target = document.getElementById('main');
		var spinner = new Spinner(opts).spin(target);
		that = this;
		this.model.set({
			blurbschema_id: makeid()
		});
		this.model.fetch({
			error: function() {
				that.model.set({
					blurbschema_id: makeid()
				});
				return
			}
		})
		this.model.set({
			title: $('#title').val(),
			images: images,
		})
		console.log('create and show blurb');
		this.model.create({
			success: function(model) {
				spinner.stop();
				var blurbview = new App.Blurbview({
					model: model
				});
			},
			error: function(model, response) {
				console.debug('not saved - why oh why' + response)
				console.log('go home');
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
		that = this;
		console.log('model inside blurbview is = ' + this.model.get('blurbschema_id'));
		document.title = "#" + this.model.get('blurbschema_id');
		this.render();
	},
	events: {
		'click .button#new': 'new',
		'click .share#mail': 'mail',
		'click .share#twitter': 'twitter',
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
		console.log('new');
		app.navigate('/', {
			trigger: true
		});
	},
	mail: function() {
		console.log('mail');
    var subject= "Some information";
    var body = "I thought you might find this information interesting:\r\n\r\n<";
    body += document.location;
    body += ">";
    var uri = "mailto:?subject=";
    uri += encodeURIComponent(subject);
    uri += "&body=";
    uri += encodeURIComponent(body);
    window.open(uri);

    
	},
	twitter: function() {
		console.log('twitter');
		var twtTitle  = document.title;
		var twtUrl    = location.href;
		var maxLength = 140 - (twtUrl.length + 1);
		if (twtTitle.length > maxLength) {
			twtTitle = twtTitle.substr(0, (maxLength - 3))+'...';
			}
			var twtLink = 'http://twitter.com/home?status='+encodeURIComponent(twtTitle + ' ' + twtUrl);
window.open(twtLink);


	
		}, 

rendercarousel: function() {
	that = this;
	$('#images').empty();
	for (var m = 0; m < images.length; m++) {
		html = that.imagetpl({
			data: images[m]
		})
		$('.images').append(html);
	}
	//	Reveal.initialize(revealopts)
	// Display controls in the bottom right corner
},
});