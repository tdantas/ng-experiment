function TriggerEngine() {
  this.triggers = [];
}

TriggerEngine.prototype.addTrigger= function(rule) {
  var that = this;
  this.triggers.push(rule);
  return function() {
    var index = that.triggers.indexOf(rule);
    if(index >= 0) { that.triggers.splice(index, 1); }
  }
}


TriggerEngine.prototype.run = function(value) {
  var result = [];
  this.triggers.forEach(eacher);
  return result;

  function eacher(tr) {
    if( tr.eval(value) ) {
      result.push(tr.action)
    }
  }
}

function GreaterThanEqual(type, value) {
  this.type = type;
  this.value = value;
}

GreaterThanEqual.prototype.eval = function(value) {
  return value[this.type] >= this.value;
}

function AND(leftOperand, rightOperand) {
  this.leftOperand  = leftOperand;
  this.rightOperand = rightOperand;
}

AND.prototype.eval = function(value) {
  var left  = this.leftOperand.eval(value);
  var right = this.rightOperand.eval(value);
  return left && right;
}

var TriggerFactory = {};
TriggerFactory.builders = {
  gte: GreaterThanEqual
}

function Rule(condition) {
  this.condition = condition;
}

Rule.prototype.eval = function(value) {
  return this.condition.eval(value);
}

function Trigger(condition, action) {
  this.condition = condition;
  this.action = action
}

Trigger.prototype.eval = function(value) {
  return this.condition.eval(value);
}

TriggerFactory.create = function(raw) {

  var prepositions = [];
  var ruleCond = raw.condition;
  for(var field in ruleCond) {
    prepositions.push( buildCondition(field, ruleCond[field] ))
  }

  var condition = prepositions.reduce(reducer, prepositions.shift());
  return new Trigger(condition, raw.trigger) 

  function buildCondition(type, cond) {
    var condition = TriggerFactory.builders[cond.operator];
    var rule = new Rule(new condition(type, cond.value));
    return rule;
  }

  function reducer(acc, current) {
    return new AND(acc, current);
  }

}


console.log('----- testing this shit mother fucker ----- ')
var params = { rule: { condition:  { age:  { operator: 'gte', value: 10 }, exams: { operator: 'gte', value: 10 } }, trigger: 'hello world trigger' } };
var params2 = { rule: { condition: { age: { operator: 'gte', value: 20 }, exams: { operator: 'gte', value: 18 } }, trigger: 'hello world trigger 2' } };

var re = new TriggerEngine();
re.addTrigger( TriggerFactory.create(params['rule']) )
re.addTrigger( TriggerFactory.create(params2['rule']) )

var input = { name: 'thiago', exams: 30, age: 30 }
var triggers = re.run(input);

triggers.forEach(function(trigger) {
  console.log(trigger)
})