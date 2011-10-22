(function(window){

var theCrag = {
	area: function(id){
		return new Area(id);
	}
};



/*
 an Area object
 */
var Node = function(){};

Node.prototype.done = function(callback){
	this.promise.then(function(data){
		this.data = data.data;
		callback(this.data);
	});
};

var Area = function(id){
	this.promise = $.ajax({url: 'http://dev.thecrag.com/area/'+id+'/json?jsonp=', dataType: "jsonp", jsonp: "jsonp"});
};
Area.prototype = new Node();
Area.prototype.parent = function(){
	this.promise.then(function(data){
		var parent = new Area(data.parent);
		return parent;
	});
}

var Route = function(){};
Route.prototype = new Node();

window.theCrag = theCrag;


})(window);
