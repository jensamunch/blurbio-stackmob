var App = App || {};
"use strict";
App.Postview = Backbone.View.extend({
	el: '#main',
	tpl: _.template($("#newviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	initialize: function() {
		_.bindAll(this);
		files = [];
		images = [];
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
		$('#redactor').redactor(textopts);	
	},
		

	
	selectfiles: function(evt) {
		files = evt.target.files;
		images = [];
		if (files) {
			if ($('#size').val() == 'phone') {
				var w = 500;
				var h = 500;
			} else {
				var w = 1000;
				var	h = 1000;
			}
			for (var m = 0, f; f = files[m]; m++) {
				setimages(f, w, h);
			}
		}
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
			title: $('#redactor').val(),
			images: images,
		})
		this.model.create({
			success: function(model) {
				spinner.stop();
				var blurbview = new App.Blurbview({
					model: model
				});
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
		that = this;		
		var str = this.model.get('title');		
		var div = document.createElement("div");
		div.innerHTML = str;
		var text = div.textContent || div.innerText || "";
		
		document.title = "#" + this.model.get('blurbschema_id') + '...' + text.substring(0,20);
		var url = Backbone.history.getFragment();
			_gaq.push(['_trackPageview', "/#"+url]);
		this.render();
	},
	events: {
		'click .button#new': 'new',
		'click .share#mail': 'mail',
		'click .share#twitter': 'twitter',
	},
	render: function() {
		html = this.tpl(this.model.toJSON());
		$(this.el).html(html)
		//show tweets
		gettweets('#' + this.model.get('blurbschema_id'));

		//render images if there are any - if not try to get them
		images = this.model.get('images');
		if (images[0]) {
			this.rendercarousel(images);
		}
	},
	new: function() {
		app.navigate('/', {
			trigger: true
		});
	},
	mail: function() {
    var subject= document.location;
    var body = "\r\n\r\n";
    body += 'Here\'s something I wanted to share - ' + document.location;
    var uri = "mailto:?subject=";
    uri += encodeURIComponent(subject);
    uri += "&body=";
    uri += encodeURIComponent(body);
    window.open(uri);

    
	},
	twitter: function() {
		var twtTitle  = document.title;
		var twtUrl    = location.href;
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