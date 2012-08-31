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
	
	showadmin: function() {
		console.log('showadmin')
		
		//housekeeping
		currentpage = 'admin';
		$(".navigate").html('blurb.io')
		$(".navigate").attr("id","new");
		
		//remove things
		textview.hide();
		imagecollection.reset();
		dropzoneview.hide();
		urlview.hide();
		texteditview.hide();
		
		//show things
		adminview.render();
		
		_gaq.push([ '_trackPageview', "/admin/" ]);
		
	},
	
	shownew: function() {
		
		//housekeeping
		currentpage = 'new';
		$(".navigate").html('> > > >')
		$(".navigate").attr("id","create");
		$(document).attr( "title", "blurb.io BETA" );
		
		//remove things
		adminview.hide();
		textview.hide();
		imagecollection.reset();
		
		//show things
		urlview.render();
		dropzoneview.show();
		texteditview.show();
		
		_gaq.push([ '_trackPageview', "/new/" ]);
		
	},
	
	showblurb: function() {
	
		//housekeeping
		currentpage = 'new';
		$(".navigate").html('blurb.io')
		$(".navigate").attr("id","new");
		currentpage = 'blurb';
		$(document).attr("title", "blurb.io BETA #" + blurbmodel.get('blurbschema_id') );		
		
		//remove things
		adminview.hide();
		dropzoneview.hide();
		urlview.hide();
		texteditview.hide();
		
		//show things		
		textview.render();
		
		//stop spinner
		spinner.stop();
		$("#spinner").hide();
		
		if (blurbmodel.get('blurbschema_id') == homepage ) {
			_gaq.push([ '_trackPageview', "/home/" ]);
		} else {
			_gaq.push([ '_trackPageview', "/blurb/" + blurbmodel.get('blurbschema_id') ]);	
		}
		

	},

})

App.Adminview = Backbone.View.extend({
	
	el: $('#admin'),
	
	tpl: _.template($("#admintpl").html()),
	
	initialize: function() {
		_.bindAll(this);
	},
	
	events: {
		"submit form" : "login",
		"click #createuser" : "create",
		"click #logoutuser" : "logout",
		"click #checkuser" : "check",
		"click #delete" : "deleteall",
	},
	
	render: function() {
		var html = this.tpl(this.model.toJSON());
        this.$el.html(html);
        this.$el.show();
	},
	
	hide: function() {
		this.$el.hide();	
	},
	
	setall: function() {
    	username = $('#username').val();
		password = $('#password').val();	
    	this.model.set({ username: username, password: password })
	},
	
	create: function() {
		this.setall();
		this.model.create({
			success: function(model) {
		      //Print out "Bill Watterson: cartoonist"
		      console.log('created ' + model.get('username'));
			    },
		    error: function(model, response) {
		      console.log("curses! we have failed, Hobbes!");
		      }
		  });	
	},
	
	login: function() {
		this.setall();
    	this.model.login({
			success: function(model) {
		      //Print out "Bill Watterson: cartoonist"
		      $('#loggedin').html(model.get('username'));
		      console.log('logged in - ' + model.get('username'));
			  $('#loggedin').html( model.get('username') );
			    },
		    error: function(model) {
		      console.log("curses! we have failed, Hobbes!");
		      }
		  });
		  
		  return false;
	},

  	logout: function() {
    	this.model.logout({
			success: function(model) {
		      //Print out "Bill Watterson: cartoonist"
		      $('#loggedin').html('nobody');
			    },
		    error: function() {
		      console.log("curses! we have failed, Hobbes!");
		      }
		  });
	
    	
    },
    
    check: function() {	
	  var string = JSON.stringify(this.model)
	  console.log(string)
	  console.log('logged in is: ' + this.model.isLoggedIn());
	  
    },

	deleteall: function() {
		console.log('starting query')
		that = this;
		var date=new Date();
		var datevalue = date.valueOf();
		
		var stackmobQuery = new StackMob.Collection.Query();
		stackmobQuery.lt('expirydate', datevalue);
		
		blurbcollection.query(stackmobQuery, {
			success: function(collection) {
		      console.log('query finished')
		      collection.each(that.deleteone)
		      }
		    });	
		
	},    
    
    
    deleteone: function(model) {
	    string = JSON.stringify(model)
		console.log('deleting' + model.get('blurbschema_id'))


    },

    
    harmless: function() {
	    model.destroy({
			success: function() {
		      //Print out "Bill Watterson: cartoonist"
		      console.log('destroyed');
			    },
		    error: function() {
		      console.log("failed");
		      }
		  }); 
	    
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
			// 	
		},
		
		hide: function() {
			this.$el.hide();
		},
		
		settext: function() {
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
		"dragover #dropzone" : "handledragover",
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
	
	handledragover: function(event) {
	    event.stopPropagation();
	    event.preventDefault();
	    event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
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
	
	tagName: 'li',
	
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