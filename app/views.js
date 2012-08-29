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

	shownew: function() {
		currentpage = 'new';
		
		//remove things
		textview.hide();
		imagecollection.reset();
		
		$(".navigate").html('> > > >')
		$(".navigate").attr("id","create");
		
		urlview.render();
		dropzoneview.show();
		texteditview.show();
		
		_gaq.push([ '_trackPageview', "new." ]);
		
	},
	
	showblurb: function() {
		currentpage = 'new';
		
		$(".navigate").html('blurb.io')
		$(".navigate").attr("id","new");
		currentpage = 'blurb';
				
		dropzoneview.hide();
		urlview.hide();
		texteditview.hide();
				
		textview.render();
		
		//stop spinner
		spinner.stop();
		$("#spinner").hide();
		
		$('body').show();

		_gaq.push([ '_trackPageview', "/blurb/#" + blurbmodel.get('blurbschema_id') ]);

	},

})

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
		that = this;
		console.log('creating');
		
		//start spinner and deactivate button
		console.log('spinner');
		$("#spinner").show();
		spinner.spin(spinnertarget);
		
		//get model ready to save
		this.model.setimages();
		this.model.setexpiry(7);
		texteditview.settext();
		
		//create model
		blurbmodel.create({
			success: function(model) {
				that.successcreate();
			},
			error: function(model,response) {
				spinner.stop();
				$("#spinner").hide();
				app.navigate('');
				console.log('FAILED TO SAVE');
				console.log(model);
				console.log(response);
				//mark error
			}
		});
		
	},
	
	successcreate: function() {
		console.log('successcreate');
		app.navigate(blurbmodel.get('blurbschema_id'), {trigger: false});				
		appview.showblurb();
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


App.Urlview = Backbone.View.extend({
	
	el: $("#url"),
	
	initialize: function() {
		_.bindAll(this);
	},
		
	events: {
		'change #blurbschema_id' : 'changeurl',
	},
	
	render: function() {	
		this.$el.show();
		$('#blurbschema_id').attr('value', this.model.get('blurbschema_id') );
	},
	
	hide: function() {
		this.$el.hide();
	},
	
	changeurl: function(url) {
		console.log('changed url');
		newid = $("#blurbschema_id").val();
		blurbmodel.set({ blurbschema_id : newid })
		console.log(newid)
		  blurbmodel.fetch({
			success: function() {
				//This mean duplicate ID
				$('.control-group').addClass('error');
				},
			error: function() {
				//This means we're A OK
				$('.control-group').removeClass('error');
				$('.navigate').removeAttr("disabled");
				
				},		
			})
		
	},
	
		
})

App.Texteditview = Backbone.View.extend({
		
		el: $("#textedit"),
		
		initialize: function() {
			_.bindAll(this);
		},
		
		show: function() {
			this.$el.show()
			$('#redactor').redactor(redactoropts);	
		},
		
		hide: function() {
			this.$el.hide();
		},
		
		settext: function() {
			console.log('setting text to' + $('#redactor').val())
			this.model.set({ blurbtext : $('#redactor').val() })
		},
		
	
})

App.Textview = Backbone.View.extend({
		
		el: $("#text"),
		
		initialize: function() {
			_.bindAll(this);
		},

		hide: function() {
			this.$el.hide();
		},
		
		render: function() {
			this.$el.empty();
			this.$el.show();
			this.$el.append(this.model.get('blurbtext'));
		},
	
})

App.Dropzoneview = Backbone.View.extend({
	
	el: $("#files"),
	
	initialize: function() {
		_.bindAll(this);
	},
		
	events: {
		"drop #dropzone" : "drophandler",
		'click #dropzone' : 'triggerfile',
		'change #fileselect' : 'fileselect',
	},

	show: function() {
		console.log('showing dropzone');
		this.$el.show()	
	},
	
	hide: function() {
		this.$el.hide();
	},
	
	triggerfile: function() {
		$("#fileselect").click();
	},
	
	fileselect: function(event) {
		files = event.target.files;
			for (var m = 0, f; f = files[m]; m++) {
				if (m >14) {continue;}
				if (!f.type.match('image.*')) {continue;}		
				//add to collection
				addimage(f, m);				
			}
		
	},

	drophandler: function(event) {
		console.log('drophandler')
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
		this.$el.show();
		imageview = new App.Imageview({model: model});
        imageview.render();
        $(this.el).append(imageview.el);
		this.childviews.push(imageview);
	},
	
	removechildren: function() {
		this.$el.hide();
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
        if (currentpage == 'new') {
        this.model.destroy();
        this.close();
        }
    },
    
});