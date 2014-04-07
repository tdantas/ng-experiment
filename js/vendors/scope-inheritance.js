function ScopeInheritance() {}

ScopeInheritance.prototype.build = function() {
  var childScope = function(){ }
  childScope.prototype = this;
  return new childScope();
}

console.log(' ----- ScopeInheritance ------- ' );
var parent = new ScopeInheritance();
parent.profileName = 'thiago';
parent.profile = { name: 'thiago inside object' }


console.log(parent.profileName, '----' , parent.profile.name)

var child = parent.build();
console.log(child.profileName);

child.profileName = 'dantas';
parent.profile.name = 'thiago child changes';

console.log(child.profileName, ' --- ' ,parent.profileName);
console.log(child.profile.name, ' --- ' , parent.profile.name);