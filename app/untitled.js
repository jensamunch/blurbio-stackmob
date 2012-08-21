	createblurb: function() {
		//start spinner		
		var target = document.getElementById('main');
		var spinner = new Spinner(spinopts).spin(target);
		that = this;
		this.model.set({
			blurbschema_id: makeid(),
			title: $('#redactor').val(),
		})
		if (typeof images != 'undefined') {
			this.model.set({
				images: images,
			})
		}
		this.model.create({
			success: function(model) {
				spinner.stop();
				blurbview = new App.Blurbview({
					model: model
				});
				appview.showview(blurbview);
			},
			error: function(model, response) {
				},
		});
		app.navigate(this.model.get('blurbschema_id'), {
			trigger: false
		});
	},