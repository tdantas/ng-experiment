function DI() {
  this.dependencies = {};
}

DI.prototype.run = function(fn) {
  var REGEX_ARGUMENTS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var text = fn.toString();
  var args = fn.injectNames || text.match(REGEX_ARGUMENTS)[1].split(',');
  fn.apply(fn, this.locateDeps(args));
}

DI.prototype.locateDeps = function (params) {
  var self = this;
  return params.map(function(value) { 
    return self.dependencies[value.trim()]; 
  });
}

DI.prototype.register = function(name, dep) {
  this.dependencies[name] = dep;
}

// It is science bitches ! Ass: Pinkman
function MedicController(PatientLocator, PatientTestLocator) {
  console.log(PatientLocator.locateByName('thiago'))
  console.log(PatientTestLocator.locateByName('thiago'))
}

MedicController.injectNames = ['PatientLocator', 'PatientTestLocator']

PatientLocator = {
  locateByName: function(name) { return { name: 'thiago', last: 'dantas' } }
}

PatientTestLocator = {
  locateByName: function(name) { return { name: 'testFirstName', last: 'testLastName' } }
}

var di = new DI();
di.register('PatientLocator', PatientLocator);
di.register('PatientTestLocator', PatientTestLocator);

di.run(MedicController);
