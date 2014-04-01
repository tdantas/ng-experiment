var nop = function(){}

function Scope() {
  this.watchers   = [];
  this.asyncQueue = [];
  this.phase = null;
}

Scope.prototype.beginPhase = function(phase) {
  if(this.phase) throw this.phase + ' already running';
  this.phase = phase;
}

Scope.prototype.clearPhase = function() {
  this.phase = null;
}

Scope.prototype.watch = function(watchFn, listener, valueComparator) {
  this.watchers.push({watchFn: watchFn, listener: listener || nop , valueComparator: !! valueComparator })
}

Scope.prototype.digest = function() {
  var ttl = 10;
  var dirty = false;
  this.beginPhase('digesting');

  do {
    
    while(this.asyncQueue.length) {
      var task = this.asyncQueue.shift();
      this.eval(task.expression);
    }

    dirty = nestedLoop.call(this);
    if( dirty && !(ttl--)){
      this.clearPhase();
      throw 'Problem to stabilize dirty checking !'
    } 

  } while(dirty)

  this.clearPhase();
   

  function nestedLoop() {
    var that  = this;
    var dirty = false;

    _.forEach(this.watchers, function(watcher) {
      var newValue = watcher.watchFn(that);
      var oldValue = watcher.value;
      if( ! equal(newValue, oldValue, watcher.valueComparator) ) {
        watcher.listener(newValue, oldValue, that);
        watcher.value = ( watcher.valueComparator ? _.cloneDeep(newValue) : newValue)
        dirty = true;
      }
    })

    return dirty;
  }

  function equal(newValue, oldValue, valueComparator) {
    if(valueComparator) { return _.isEqual(newValue, oldValue) }
    else {
      return newValue === oldValue || ( typeof newValue === 'number' && typeof oldValue === 'number' &&
       isNaN(newValue) && isNaN(oldValue));
    }
  }

}

Scope.prototype.eval = function(expression, locals) {
  return expression(this, locals);
}

Scope.prototype.apply = function(expression) {
  try {
    this.beginPhase('apply');
    return this.eval(expression);
  } finally {
    this.clearPhase();
    this.digest();
  }
}

Scope.prototype.evalAsync = function(expression) {
  var that = this;
  
  if(! this.phase && this.asyncQueue.length > 0) {
    setTimeout(function(){
      if(that.asyncQueue.length) {
        self.digest();
      }
    },0)
  }

  this.asyncQueue.push({ scope: this, expression: expression })
}


var scope = new Scope();
scope.asyncCounter = 1;

scope.watch(
  
  function(scope) {
    return scope.asyncCounter;
  },
  
  function(newValue, oldValue, scope) {
    scope.evalAsync(function(scope) { scope.asyncCounter++; });
    console.log("eval - listener: "+ scope.asyncCounter);
  }

);

scope.digest();
console.log("eval after async: " + scope.asyncCounter);
