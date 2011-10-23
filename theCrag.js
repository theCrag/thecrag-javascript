/*
Copyright (c) 2011 Brendan Heywood

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

https://github.com/theCrag/thecrag-javascript


TODO - make DAO that do all the ajak in one place.
TODO - make a caching DAO that leverages the 'live' DAO
TODO - make any updates mark the object as dirty, store the original object and send the diff to save. Capture the done and clear dirty flag

TODO - make it handle collections as well as single objects


 */

(function(window){

var theCrag = {
	area: function(id){
		return new Area(id);
	},
	route: function(id){
		return new Route(id);
	},
	world: function(){
		return new Area('7546063');
	}
};



/*
 an Area object
 */
var Node = function(){
	this.type = 'unknown';
};


/*
 * Adds a callback for once we have data available
 */
Node.prototype.get = function(callback){
	var node = this;
	this.promise.then(function(data){
		node.data = data.data;
		callback(node);
	}, function(error){
		alert('Error: '+error);
	});
};

/*
 *
 */


/*
 * Return a Parent with a promise for data
 */
Node.prototype.parent = function(){
	var parent = new Area();
	var node = this;
	var deferred = $.Deferred();
	this.promise.then(function(data){
		var parentId = data.parent || data.data.ancestors[data.data.ancestors.length-1].id;
		var promise = $.ajax({url: 'http://dev.thecrag.com/area/'+parentId+'/json', dataType: "jsonp", jsonp: "jsonp"});
		promise.done(function(obj){
			node.data = obj.data;
			deferred.resolve(node);
		});
	}, function(error){
		deferred.fail();
		alert('Error: '+error);
	});
	parent.promise = deferred.promise();
	return parent;
}

var Area = function(id){
	this.type = 'area';
	if (id){
		this.promise = $.ajax({url: 'http://dev.thecrag.com/area/'+id+'/json', dataType: "jsonp", jsonp: "jsonp"});
	}
};
Area.prototype = new Node();

var Route = function(id){
	this.type = 'route';
	this.promise = $.ajax({url: 'http://dev.thecrag.com/route/'+id+'/json', dataType: "jsonp", jsonp: "jsonp"});
};
Route.prototype = new Node();

window.theCrag = theCrag;


})(window);
