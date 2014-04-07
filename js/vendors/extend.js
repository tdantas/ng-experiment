Function.prototype.extend = function(parent) {

  this.prototype = extend({ }, parent.prototype, { parent: parent.prototype, constructor: this })
  return this;

  function extend(destination) {
    var args =  Array.prototype.slice.call(arguments, 0);
    args.shift(); //removing destination
    _.forEach(args, function(source){
      for(var field in source) {
        if(source.hasOwnProperty(field))
          destination[field] = source[field];
      }
    })
    return destination;
  }

}

console.log('  ---------- Inheritance ---------- ');
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function(){
  return this.name;
}

function Child(name) {
  this.name = name;
}

Child.extend(Parent);

Child.prototype.getName = function() {
  console.log('overriding getName method')
  return this.parent.getName.call(this) + " [ Dantas ] "
}

var child = new Child('thiago teixeira')
console.log(child.getName())

console.log('  ---------- Inheritance ---------- ');

