var App = App || {};
"use strict";

App.Appmodel = Backbone.Model.extend({
});

App.Blurbmodel = StackMob.Model.extend({
	schemaName: 'blurbschema',
});

App.Imagemodel = Backbone.Model.extend({});

App.Imagecollection = Backbone.Collection.extend({
	model: App.Imagemodel,
})
