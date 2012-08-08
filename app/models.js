var App = App || {};
"use strict";

App.Blurbmodel = StackMob.Model.extend({
	
	schemaName	:	'blurbschema',
	
	defaults: {
		uid: 'string',
		title : 'title',
		description: 'string',
		expirydate: "string",
		images : 'array[string]',
		background : 'string',
	}
})

