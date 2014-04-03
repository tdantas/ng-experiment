Function.prototype.extend = function(parent) {
  
  this.prototype = extend({ }, parent.prototype, { parent: parent.prototype, constructor: this })
  return this;

  function extend(destination) {
    var args =  Array.prototype.slice.call(arguments, 0);
    args.shift(); //removing destination
    _.forEach(args, function(source){
      for(var field in source) {
        destination[field] = source[field];
      }
    })
    return destination;
  }

}

function GrandFather(name) {
  this.name = 'holmes'
}

GrandFather.prototype.sayMyName = function(){
  return this.name;
}

function Father() { }
Father.extend(GrandFather);
Father.prototype.getAddress = function() {
  return 'address';
}

function Child() {
  this.name = 'thiago'
}
Child.extend(Father)

Child.prototype.xxx = function() {
 return 'child';
}

Child.prototype.sayMyName = function() {
  return 'child call "super" -> ' + this.parent.sayMyName.call(this)
}

var c = new Child();
console.log(c.sayMyName());
console.log(c.getAddress());
console.log(c.xxx());
var gf = new GrandFather();
console.log(gf.sayMyName())