var App = App || {};
"use strict";

App.BlurbModel = Backbone.Model.extend({
	defaults: {
		id: null,
		title: "Default Title",
		description: "Default Description",
		expiry: "Default Expiry",
	}
})

