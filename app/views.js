var App = App || {};
"use strict";


Backbone.View.prototype.close = function() {
	console.log('inside prototype close');
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
	clearmain: function(view) {
		this.mainview.close();
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
		app.navigate('new/', { trigger : true })
	},
	
	gocreate: function() {		
	
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
			images: images,
		})
		
		//set expirydate
		blurbmodel.setexpiry(7);
		
		//create model
		blurbmodel.create({
			success: function(model) {
				spinner.stop();
				$("#spinner").hide();
				$(".navigate").html('blurb.io');
				$(".navigate").attr("id","new");
				_gaq.push([ '_trackPageview', "/new/created/" ]);
				app.navigate(blurbmodel.get('blurbschema_id'), {trigger: false});
				appview.clearmain(newview);
			},
			error: function() {
				spinner.stop();
				$("#spinner").hide();
				app.navigate('');
				console.log('FAILED TO SAVE');
			}
		});

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
		'dragover #dropzone' : 'handledragover',
	},
	
	onclose: function() {
		$(this.el).undelegate('#inputfiles', 'change');
		$(this.el).undelegate('#blurbschema', 'change');
		
	},
	

	render: function() {
		this.$el.html(this.tpl( {blurbschema_id : this.model.get('blurbschema_id') } ));
		_gaq.push(['_trackPageview', "/new/"])
		console.log('newview render');
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
	

	handledragover: function(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();
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
				//add to collection
				addimage(f, m);				
			}
		
	},
	
})



App.Imagesview = Backbone.View.extend({

	el: $(".imagescontainer"),
		
	initialize: function() {
		_.bindAll(this);
		console.log('imageview init');
		this.collection.on("add", this.addimage)
		this.collection.on('reset', this.removechildren);
		this.childviews = [];
	},
	
	onclose: function(){
    	this.collection.unbind("add", this.addimage);
    	this.collection.unbind("reset", this.hideview);
    },
	
	addimage: function(model) {
		console.log('adding image')
		this.$el.show();
		imageview = new App.Imageview({model: model});
		this.childviews.push(imageview);
        imageview.render();
        $(this.el).append(imageview.el);
	},
	
	removechildren: function() {
		//this.$el.hide();
		console.log('removechildren');
		//need to delete children
		_.each(this.childviews, function(childview){
			console.log('removing child')
		    if (childview.close){
	        childview.close();
		    	}
		    })
		    },
	
});

App.Imageview = Backbone.View.extend({

	tpl: _.template($("#imagetpl").html()),
	
	initialize: function() {
			
	},
	
	events:  {
		"click": "clicked"	
	},
	
	render: function() {
        var html = this.tpl(this.model.toJSON());
        $(this.el).append(html);
	},
	
	
	clicked: function(e){
        this.model.destroy();
        this.close();
    },
    
});