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
});


App.Headerview = Backbone.View.extend({
	
	el: $('#header'),
	
	initialize: function() {
	},
	onclose: function(){
    },
	
	events: {
		'click .share#email': 'email',
		'click .share#twitter': 'twitter',
		'click .navigate#home': 'gohome',
		'click .navigate#new': 'gonew',
		'click .navigate#create': 'gocreate',
	},
	

		
	gohome: function() {
		app.navigate('', {trigger: true})	
	},
	
	gonew: function() {
		app.navigate('new/', {trigger : true})
	},
	
	gocreate: function() {
		console.log('headerview gocreate')
		
		appmodel.set({page : 'blurb'});
		
		$(".navigate").html('Home');
		$(".navigate").attr("id","home");
		
		//start spinner and deactivate button
		$("#spinner").show();
		var target = document.getElementById('spinner');
		var spinner = new Spinner(spinopts).spin(target);
		
		//set blurbmodel
		blurbmodel.set({
			title: $('#redactor').val(),
			images: images,
		})

		//create model
		blurbmodel.create({
			success: function(model) {
				spinner.stop();
				$("#spinner").hide();
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
		console.log('newview render');
		
		setTimeout(function(){
		$('#redactor').redactor(redactoropts);
		},100);
		
		$('#redactor').show();
	},
	
	selectfiles: function(evt) {
		console.log('files selected');
		
		//reset the variable images
		images.length = 0;
		
		files = evt.target.files;			
			for (var m = 0, f; f = files[m]; m++) {
				if (!f.type.match('image.*')) {continue;}		
				//add to array
				addimage(f, m);				
			}
		setTimeout(function(){
		blurbmodel.set('images',images);
		blurbmodel.triggerimages();
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
		_gaq.push(['_trackPageview', "/blurb/" + blurbmodel.get('blurbschema_id')]);
		
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


App.Imagesview = Backbone.View.extend({

	tpl: _.template($("#imagetpl").html()),
	
	el: $("#images"),
		
	initialize: function() {
		_.bindAll(this);
		console.log('imageview init');
		this.model.on('change:images', this.render)
	},
	
	render: function() {
		console.log('render images')
		this.$el.empty();	
		images = blurbmodel.get("images")
		for (var i = 0; i < images.length; i++) {
			image = images[i];
			html = this.tpl({data : image});
			this.$el.append(html);
			}
		},
});