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
		this.imageview = view;
		$("#image").html(this.imageview.el);
	}
});


App.Headerview = Backbone.View.extend({
	
	el: "#header",
	
	tpl: _.template($("#headertpl").html()),
	
	initialize: function() {
		_.bindAll(this);
		console.log('headerview init');
		this.render()
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
		app.navigate(blurbmodel.get('blurbschema_id'), {trigger: false})
		
		this.model.set({page : 'blurb'});
		this.model.set({button : 'BLURB.IO'});
		
		blurbview = new App.Blurbview({model : blurbmodel})
		appview.showmain(blurbview);
		//start spinner and deactivate button
		//then create the blurb
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
		
	render: function() {
		that = this;
		this.$el.empty();
		html = this.tpl(this.model.toJSON());
		this.$el.html(html);
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
		_gaq.push(['_trackPageview', "/new/"])
		
		this.model.set({ blurbschema_id : makeid() })
		console.log('render new');
		this.$el.html(this.tpl());

		setTimeout(function(){
		$('#redactor').redactor(textopts);
		},500);
		
		$('#redactor').show();
	},
	selectfiles: function(evt) {
		files = evt.target.files;			
				imagecollection.reset();
				var w = 600;
				var h = 600;
				
				for (var m = 0, f; f = files[m]; m++) {
					if (!f.type.match('image.*')) {continue;}
					setimages(f, w, h);
				}

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
		
		html = this.tpl();
		console.log(html);
		this.$el.html(html)
		
		var str = this.model.get('title');
		var div = document.createElement("div");
		div.innerHTML = str;
		var text = div.textContent || div.innerText || "";
		document.title = text.substring(0, 40) + '...';
		
		
		//show tweets
		//gettweets('#' + this.model.get('blurbschema_id'));
		//render images if there are any - if not try to get them
		
		images = this.model.get('images');
		this.renderimages(images);

	},	

});


App.Imageview = Backbone.View.extend({

	tpl: _.template($("#imagetpl").html()),
	
	initialize: function() {
		_.bindAll(this);
		console.log('imageview init');
	},
	
	events: {
		//this.collection.on('add', this.render);
		//this.collection.on('remove', this.render);
		
	},
	close: function() {},
	
	render: function() {
		this.$el.empty();	
		this.collection.each(function(model){
			html = this.tpl(this.model);
			this.$el.append(html)
		})
		
	},
});