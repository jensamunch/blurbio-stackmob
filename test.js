document.getElementById('files').addEventListener('change', fileselect, false);
console.log(document.getElementById('files'))

var array = [];


var render = function() {
		for (var m = 0; m < array.length; m++) {
			html = ('<img src=' + array[m] + '>');
			$('#main').append(html);
		}
		console.log(this.model);
	}
	
var fileselect = function(evt) {
		console.log('fileselect');
		var files = evt.target.files; // FileList object
		for (var i = 0, f; f = files[i]; i++) {
			//setimages(f);
		}
		//they're all in = now trigger rendercaorousel
		console.log('theyre all in - rendering new images');
		setTimeout(alert(), 2000);
		//for some reason it all breaks when this line is active
		//that.rendercarousel();
	}