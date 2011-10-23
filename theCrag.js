(function(window){

var theCrag = {
	area: function(id){
		return new Area(id);
	},
	route: function(id){
		return new Route(id);
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
Node.prototype.done = function(callback){
	var node = this;
	this.promise.then(function(data){
		node.data = data.data;
		callback(node);
	}, function(error){
		alert('Error: '+error);
	});
};

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
