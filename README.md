# theCrag's javascript API wrapper


 * Request an object, and some properties and a callback
 * traverse the node struture, using jQuery defered a lot?
 * A local cache with dirty bit
 * Live sync or, manual sync



```javascript
tC(13342327).get(function(node){
	alert(node.data.title); // return Layabout
});
```

Chaining

```javascript

tC(13342327).get(function(node){
	alert(node.data.title); // return Illusion Buttress
});
```




Not yet implemented:

```javascript


tC.climber(12345)
tC.climber('brendan', 'friends')


// Setting attributes
tC(12345).set('title', 'this node sucks');
tC(12345).set({'title': 'this node sucks'});
```


Each node has a dirty flag if it has local changes waiting sync


Node()
.parent()
.children()
.attr()

 Route()
 Area()



 Climber()
 Ascent()




