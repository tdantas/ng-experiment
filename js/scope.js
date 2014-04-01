var nop = function(){}

function Scope() {
  this.watchers = []
}

Scope.prototype.watch = function(watchFn, listener) {
  this.watchers.push({watchFn: watchFn, listener: listener || nop })
}


Scope.prototype.digest = function() {
  var ttl = 10;
  while(nestedLoop.call(this)) {
    ttl--;
    if (ttl <= 0) throw 'Problem to stabilize'
  }

  function nestedLoop() {
    var that  = this;
    var dirty = false;

    _.forEach(this.watchers, function(watcher) {
      var newValue = watcher.watchFn(that);
      var oldValue = watcher.value;
      if(newValue !== oldValue) {
        watcher.listener(newValue, oldValue, that);
        watcher.value = newValue;
        dirty = true;
      }
    })

    return dirty;
  }

}

var scope = new Scope();
scope.middleName = 'Hello';
scope.lastName = 'Thiago';

scope.watch(
  function(scope) {
    console.log('listener')
    return scope.middleName;
  },

  function(newValue, oldValue, scope) {
    scope.middleName = 'teixeira';
  }
);

scope.digest();
