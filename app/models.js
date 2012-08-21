var App = App || {};
"use strict";

App.Appmodel = Backbone.Model.extend({
});

App.Blurbmodel = StackMob.Model.extend({
	schemaName: 'blurbschema',
});

appmodel = new App.Appmodel();
images = [];