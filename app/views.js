
var App = App || {};
"use strict";


//JSON.stringify
//toJSON
//console.log(this.template());

App.Homeview = Backbone.View.extend({
	el: '#main',
	template: _.template($("#homeviewtpl").html()),
	initialize: function() {
		this.render()
	},
	render: function() {
		console.log('homeView - Render')
		$(this.el).html(this.template())
	}
})

App.Newview = Backbone.View.extend({
	
	el: '#main',
	
	template: _.template($("#newviewtpl").html()),
	
	
	initialize: function() {
		_.bindAll(this)
		console.log('init');
		console.log(JSON.stringify(this.model))
		//this.model.on('change', this.createblurb);
		this.model.on('change', this.createblurb);
		this.render();
		
		
		
	},
	
	events: {
		'click .btn' : 'createblurb',
		//"change input": "fieldchanged",
		//"change select": "selectionchanged",
		"change input#files": "fileselect",
	},
	
	render: function() {
		console.log('newview - Render')
		this.$el.html(this.template())
		
	},
	
	createblurb: function() {
		console.log('Ready to create and show Blurb');
		console.log(JSON.stringify(this.model))
	},
	
	fieldchanged: function(e) {
		console.log('fieldchanged');
		var field = $(e.currentTarget);
		var data = {};
		data[field.attr('id')] = field.val();
		this.model.set(data);
	},
	
	selectionchanged: function() {
		console.log('selectchanged')	
	},
	
	 
  
  fileselect: function(evt) {
    var files = evt.target.files; // FileList object
 
    // Loop through the FileList
    for (var i = 0, f; f = files[i]; i++) {
 
      var reader = new FileReader();
 
      // Closure to capture the file information
      reader.onload = (function(theFile) {
        return function(e) {
 
          /*
            e.target.result will return "data:image/jpeg;base64,[base64 encoded data]...".
            We only want the "[base64 encoded data] portion, so strip out the first part
          */
          var base64Content = e.target.result.substring(e.target.result.indexOf(',') + 1, e.target.result.length);
          var fileName = theFile.name;
          var fileType = theFile.type;
          blurbmodel.setBinaryFile('photo', fileName, fileType, base64Content);
          var out = blurbmodel.save();
          console.log(out)
 
        };
      })(f);
 
      // Read in the file as a data URL
      fileContent = reader.readAsDataURL(f);
 
    }
  },
	
	
	
	
	
	
	
})
App.Blurbview = Backbone.View.extend({
	el: '#main',
	template: _.template($("#blurbviewtpl").html()),
	initialize: function() {
		this.render()
	},
	render: function() {
		console.log('blurbview - Render')
		$(this.el).html(this.template())
	}
})

