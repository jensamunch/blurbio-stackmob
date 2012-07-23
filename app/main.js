App = {
  start: function() {
	tpl.loadTemplates(['blurbview', 'postview', 'home'], function() {
	    approuter = new App.Router()
	    Backbone.history.start()
	})
  }
}


App.Router = Backbone.Router.extend({
	routes: {
		''					: 'home',
		'edit/:blurbid'		: 'editview',
		'post/'				: 'postview',
		':blurbid'			: 'blurbview',

	},

	initialize: function() {
		console.log('Router Init')
		
//Let's start with no user logged in.
console.log(StackMob.isLoggedIn()); //evaluates to false
StackMob.isUserLoggedIn('chucknorris'); //evalutes to false
 
//Now let's login "chucknorris"
var user = new StackMob.User({ username: 'jens', password: 'jens' });
user.login();
console.log(user.isLoggedIn()) //evaluates to true (because this user instance is 'chucknorris'


var user = new StackMob.User({ username: 'Bill Watterson', password: 'weirdosfromanotherplanet', profession: 'cartoonist'  });
  user.create({
    //After StackMob successfully saves "Bill Watterson", print out the result
    success: function(model) {
      //Print out "Bill Watterson: cartoonist"
      console.debug(model.get('username') + ': ' + model.get('profession'));
    },
    error: function(model, response) {
      console.debug("curses! we have failed, Hobbes!");
    }
  });



	},

	home: function () {
		console.log('home')
		var blurb = new App.BlurbModel
		new App.HomeView({model : blurb})
	},
	
	postview: function() {
		console.log('postview')
		var blurbmodel = new App.BlurbModel
		new App.PostView({model : blurbmodel})
	},
	
	editview: function(blurbid) {
		console.log('editview')
		var blurbmodel = new App.BlurbModel
		new App.PostView({model : blurbmodel, blurbid : blurbid})
	},
	
	blurbview: function(blurbid) {
		console.log('blurbview')
		var blurbmodel = new App.BlurbModel
		var blurbview = new App.BlurbView({model : blurbmodel, blurbid : blurbid});
	}
	
})

$(function() { App.start(); })



