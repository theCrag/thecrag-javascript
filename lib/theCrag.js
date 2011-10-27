/*
Copyright (c) 2011 Brendan Heywood

Released under the LGPL v3+

https://github.com/theCrag/thecrag-javascript


TODO - make a caching DAO that leverages the 'live' DAO
TODO - make any updates mark the object as dirty, store the original object and send the diff to save. Capture the done and clear dirty flag

TODO - make it handle collections as well as single objects


 */

(function(window){


/*
 * A collection of DAO for different use cases, life, live with caching, offline with manifest+WebDB, Titanium etc
 * Each DAO implements get and set which return a promise
 */

var host = 'http://dev.thecrag.com/';

var DAO = {
	live: {
		get: function(type, id, extras, save){
			type = type == 'area' ? 'node' : type; // World isn't an area!!
			if (!extras) extras = [];
			extras.push('ancestors', 'children');
			data = "show="+ extras.join(',');
			return $.ajax({
				url: host+'api/'+type+'/id/'+id,
				data: data,
				dataType: "jsonp", 
				jsonp: "jsonp"
			});
		},
		set: function(data){
		}
	}
};

var theCrag = {
	area: function(id){
		return new Area(id);
	},
	route: function(id){
		return new Route(id);
	},
	world: function(){
		return new Area('7546063');
	},
	DAO: DAO.live
};




var NodeSet = function(){
}

/*
 * Adds a callback for once we have data available
 */
NodeSet.prototype.get = function(callback){
	var nodeset = this;
	this.promise.then(function(data){
		nodeset.data = data.data;
		callback(nodeset);
	}, function(error){
		alert('Error: '+error);
	});
};

NodeSet.prototype.set = function(data){
	// data should be an array
	this.nodes = [];
	var c;
	var node;
	for(c=0; c<data.length; c++){
		node = new Node();
		node.data = data[c];
		this.nodes[c] = node;
		node.promise = $.Deferred().resolve(node);
	}
};


/*
 a Node object
 * Can actually represent a set of Nodes as well
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
	this.promise.then(function(node){
		var parentId = node.data.parentID || node.data.ancestors[node.data.ancestors.length-1].id;

		var promise = theCrag.DAO.get('area', parentId);
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

/*
 * Return a Children NodeSet with a promise for data
 */
Node.prototype.children = function(){
	var node = this;

	var children = new NodeSet();
	var deferred = $.Deferred();
	children.promise = deferred.promise();

	this.promise.then(function(data){
		var childs = data.children;
		if (childs){
			children.set(childs);
			deferred.resolve(children);
		} else {
			// go get it
			deferred.resolve(children);
		}
	}, function(error){
		deferred.fail();
		alert('Error: '+error);
	});
	return children;
}



var Area = function(id){
	this.type = 'area';
	if (id){
		this.promise = theCrag.DAO.get(this.type, id);
	}
};
Area.prototype = new Node();

var Route = function(id){
	this.type = 'route';
	this.promise = theCrag.DAO.get(this.type, id);
};
Route.prototype = new Node();

window.theCrag = theCrag;
window.tC = theCrag;


})(window);
