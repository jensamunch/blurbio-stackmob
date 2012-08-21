var App = App || {};
"use strict";


Backbone.View.prototype.close = function() {
	this.remove();
	this.unbind();
	if (this.onclose) {
		this.onclose();
	}
}

App.Appview = Backbone.View.extend({
	showheader: function(view) {
		if (this.headerview) {
			this.headerview.close();
		}
		this.headerview = view;
		this.headerview.render();
		$("#header").html(this.headerview.el);
	},
	
	showmain: function(view) {
		if (this.mainview) {
			this.mainview.close();
		}
		this.mainview = view;
		this.mainview.render();
		$("#main").html(this.mainview.el);
	},
	
	showimage: function(view) {
		if (this.imageview) {
			this.imageview.close();
		}
		if (view == 'none') {
			imageview.close();
			console.log('closing')
			}
		this.imageview = view;
		this.mainview.render();
		$("#images").html(this.imageview.el);
	}
});


App.Headerview = Backbone.View.extend({
	
	tpl: _.template($("#headertpl").html()),
	
	initialize: function() {
		_.bindAll(this);
		console.log('headerview init');
	},
	onclose: function(){
    },
    
	render: function() {
		console.log('render header')
		html = this.tpl(this.model.toJSON());
		this.$el.html(html);
	},
	
	events: {
		'click .share#email': 'email',
		'click .share#twitter': 'twitter',
		'click .navigate#home': 'gonew',
		'click .navigate#new': 'goblurb',
		'click .navigate#blurb': 'gohome',
	},

	gohome: function() {
		app.navigate('', {trigger: true})
		this.model.set({page : 'home'});
		this.model.set({button : '> > > >'});
		this.render();		
	},
	gonew: function() {
		app.navigate('new/', {trigger : true})
		this.model.set({page : 'new'});
		this.model.set({button : '> > > >'});
		this.render();
	},
	
	goblurb: function() {
		//start spinner		
		var target = document.getElementById('images');
		var spinner = new Spinner(spinopts).spin(target);
		
		this.model.set({page : 'blurb'});
		this.model.set({button : 'BLURB.IO'});
		
		//start spinner and deactivate button
		//create the blurb
		blurbmodel.set({
			title: $('#redactor').val(),
		})
		
		console.log('text is ' + $('#redactor').val())

		//create model
		blurbmodel.create({
			success: function(model) {
				spinner.stop();
				blurbview = new App.Blurbview({model : blurbmodel})
				
				appview.showmain(blurbview);
				app.navigate(blurbmodel.get('blurbschema_id'), {trigger: false});
			},
		});

		this.render();
	},
	
	email: function() {
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
	
});

App.Homeview = Backbone.View.extend({

	//tpl: _.template($("#homeviewtpl").html()),
	tpl: _.template($("#homeviewtpl").html()),
	initialize: function() {
		_.bindAll(this);
	},
	onclose: function(){
    },
	render: function() {
		_gaq.push(['_trackPageview', "/"])
		
		console.log('render home');
		html = this.tpl();
		this.$el.html(html);
	},

})


App.Newview = Backbone.View.extend({

	tpl: _.template($("#newviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	initialize: function() {
		_.bindAll(this);
	},
		
	events: {
		'change #inputfiles': 'selectfiles',
	},

	render: function() {
		this.$el.html(this.tpl());
		_gaq.push(['_trackPageview', "/new/"])
		
		blurbmodel.set({ blurbschema_id : makeid() })
		console.log('render new');
		
		setTimeout(function(){
		$('#redactor').redactor(textopts);
		},100);
		
		$('#redactor').show();
	},
	
	selectfiles: function(evt) {
		console.log('files selected');
		images = []
		
		files = evt.target.files;			
			for (var m = 0, f; f = files[m]; m++) {
				if (!f.type.match('image.*')) {continue;}		
				//add to array
				addimage(f, m);				
			}
		setTimeout(function(){
		blurbmodel.set('images',images);
		imageview.render();
		appview.showimage(imageview);
		},500);
	},
})


App.Blurbview = Backbone.View.extend({

	tpl: _.template($("#blurbviewtpl").html()),

	initialize: function() {
		_.bindAll(this);
		console.log('blurbview init');
	
	},

	close: function() {},
	
	render: function() {	
		url = Backbone.history.getFragment()
		_gaq.push(['_trackPageview', "/blurb/" +url])
		
		var str = this.model.get('title');
		var div = document.createElement("div");
		div.innerHTML = str;
		var text = div.textContent || div.innerText || "";
		document.title = text.substring(0, 40) + '...';
		
		html = this.tpl(this.model.toJSON());
		this.$el.html(html);
		
		//show tweets
		gettweets('#' + this.model.get('blurbschema_id'));
	},	

});


App.Imageview = Backbone.View.extend({

	tpl: _.template($("#imagetpl").html()),
		
	initialize: function() {
		_.bindAll(this);
		console.log('imageview init');
	},
	
	events: {		
	},
	
	close: function() {},
	
	render: function() {
		console.log('render images')
		this.$el.empty();	
		images = []
		images = blurbmodel.get("images")
		
		for (var i = 0; i < images.length; i++) {
			image = images[i];
			html = this.tpl({data : image});
			this.$el.append(html);
			}
		
		},
});