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
		_.bindAll(this);
	},
	
	events: {
		'click .share#email': 'email',
		'click .share#twitter': 'twitter',
		'click .navigate#new': 'gonew',
		'click .navigate#create': 'gocreate',
	},
	
	onclose: function(){
    },
	
	gonew: function() {
		app.navigate('new/', {trigger : true})
	},
	
	gocreate: function() {		
		
		$(".navigate").html('blurb.io');
		$(".navigate").attr("id","new");
		
		//start spinner and deactivate button
		$("#spinner").show();
		var target = document.getElementById('spinner');
		var spinner = new Spinner(spinopts).spin(target);
		
		//create and reset temporary array
		images = []
		images.length = 0
		imagecollection.each( function(item) {
			images.push(item.get('data'))		
		})
		
		//set blurbmodel
		blurbmodel.set({
			blurbtext: $('#redactor').val(),
			images: images,
		})
		
		//set expirydate
		blurbmodel.setexpiry(7);
		
		//create model
		blurbmodel.create({
			success: function(model) {
				spinner.stop();
				$("#spinner").hide();
				blurbview = new App.Blurbview({model : blurbmodel})
				appview.showmain(blurbview);
				app.navigate(blurbmodel.get('blurbschema_id'), {trigger: false});
			},
			error: function() {
				spinner.stop();
				$("#spinner").hide();
				app.navigate('');
				console.log('FAILED TO SAVE');
			}
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
		var hashtag = '#' + blurbmodel.get('blurbschema_id');

		var twtTitle = document.title;
		var twtUrl = location.href;
		var twtLink = 'http://twitter.com/home?status=' + encodeURIComponent(twtTitle + ' ' + twtUrl);
		window.open(twtLink);
	},
	
});


App.Newview = Backbone.View.extend({

	tpl: _.template($("#newviewtpl").html()),
	imagetpl: _.template($("#imagetpl").html()),
	initialize: function() {
		_.bindAll(this);
	},
		
	events: {
		'change #blurbschema_id' : 'changeid',
		"drop #dropzone" : "drophandler",
		"click #dropzone" : "resetimages",
		'change #inputfiles' : 'selectfiles',
	},
	
	onclose: function() {
		$(this.el).undelegate('#inputfiles', 'change');
		$(this.el).undelegate('#blurbschema', 'change');
		
	},
	

	render: function() {
		this.$el.html(this.tpl( {blurbschema_id : this.model.get('blurbschema_id') } ));
		_gaq.push(['_trackPageview', "/new/"])
		console.log('newview render');
		setTimeout(this.showredactor, 0);		
	},
	
	showredactor: function() {
		$('#redactor').redactor(redactoropts);
	},
	
	changeid: function(url) {
		newid = $("#blurbschema_id").val();
		blurbmodel.set({ blurbschema_id : newid })
		  blurbmodel.fetch({
			success: function() {
				//This mean duplicate ID
				$('.control-group').addClass('error');
				$('.navigate').attr('disabled', 'disabled');
				},
			error: function() {
				//This means we're A OK
				$('.control-group').removeClass('error');
				$('.navigate').removeAttr("disabled");
				},		
			})
		
	},
	
	selectfiles: function(evt) {
		files = evt.target.files;	
		for (var m = 0, f; f = files[m]; m++) {
				if (m >14) {continue;}
				if (!f.type.match('image.*')) {continue;}		
				//add to array
				addimage(f, m);				
			}
	},
	
	
	drophandler: function(event) {
		event.stopPropagation();
        event.preventDefault();
        var event = event.originalEvent;
        event.dataTransfer.dropEffect = 'copy';
        files = event.dataTransfer.files;
		
			for (var m = 0, f; f = files[m]; m++) {
				if (m >14) {continue;}
				if (!f.type.match('image.*')) {continue;}		
				//add to array
				addimage(f, m);				
			}
		
	},
	
	resetimages: function(evt) {
		console.log('files selected');
		
		//reset imagecollection to avoid showing
		imagecollection.reset();
		
	},
})


App.Blurbview = Backbone.View.extend({

	tpl: _.template($("#blurbviewtpl").html()),

	initialize: function() {
		_.bindAll(this);
		that = this;
		console.log('blurbview init');
	
	},

	close: function() {},
	
	render: function() {	
		html = this.tpl(this.model.toJSON());
		this.$el.html(html);
		
		_gaq.push([ '_trackPageview', "/blurb/#" + blurbmodel.get('blurbschema_id') ]);
		setTimeout(function() {that.postrender() }, 0);
	},	
	
	postrender: function() { 
		var str = this.model.get('blurbtext');
		var div = document.createElement("div");
		div.innerHTML = str;
		var text = div.textContent || div.innerText || "";
		document.title = text.substring(0, 40) + '...';
		
		if (!str == '') { $('#blurbtext').show(); }
		
		var query = '#' + this.model.get('blurbschema_id');
		
		$('#tweets').show();
		$("#tweets").tweet({
			avatar_size: 32,
			count: 100,
			query: query,
			});
		
		
		},
		
});


App.Imagesview = Backbone.View.extend({

	tpl: _.template($("#imagetpl").html()),
	
	el: $("#images"),
		
	initialize: function() {
		_.bindAll(this);
		console.log('imageview init');
		//this.model.on('change:images', this.render)
		this.collection.on("add", this.addall)
		this.collection.on('reset', this.hideview);
	},
	
	onclose: function(){
    	this.collection.unbind("add", this.addall);
    	this.collection.unbind("reset", this.hideview);
    },
	
	addall: function(model) {
		this.$el.empty();
		this.collection.each(this.addimage)
	},
	
	addimage: function(model) {
		this.$el.show();
		html = this.tpl(model.toJSON());
		this.$el.append(html);	
	},
	
	hideview: function() {
		this.$el.hide();
	},
	
});