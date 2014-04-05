var app = angular.module('Study', []);

app.controller('PageCtrl', function($scope) {
  $scope.active = 'todo';

  $scope.activate = function(section) {
    console.log(arguments);
    $scope.active = section;
  }

});

app.controller('TodosController', function($scope) {
  
  $scope.todos = [

    { name:'Eat / Comer' },
    { name:'Sleep / Dormir' },
    { name:'Joy / Lazer' },
    { name:'Study / Estudar' },
    { name:'Love / Namorar' }
  
  ];

  $scope.$on('prioritized-todo', function(e, data) {
    var item = $scope.todos.splice(data.from, 1)[0];
    $scope.todos.splice(data.to, 0, item);
  })
  
  $scope.$on('added-todo', function(e, data) {
    $scope.todos.splice(data.to, 0, { name: data.name } );
  })

});

app.controller('ServicesController', function($scope) {
  $scope.services = [
    {
      name: 'Web Development',
      price: 100,
      active: true
    },{
      name: 'Talks',
      price: 75,
      active: false
    },{
      name: 'Training',
      price: 150,
      active: false
    }
  ];

  $scope.toggleActive = function(s){
    s.active = !s.active;
  };

  $scope.total = function() {
    var total = 0;
    angular.forEach($scope.services, iterate);
    function iterate(s) {
      if (s.active) { total+= s.price; }
    };
    return total;
  };

});

app.directive('draggable',function() {
  return {

    link: function(scope, el, attrs) {

      el.sortable({ revert: true});
      el.disableSelection();
      
      el.on( "sortdeactivate", function( event, ui ) {
        var from = angular.element(ui.item).scope().$index;
        var to = el.children().index(ui.item);

        if(to >= 0) {
          scope.$apply(changeTodoList);
          function changeTodoList() {
            if(from>=0) {
              scope.$emit('prioritized-todo', { from: from, to: to });
            } else { 
              scope.$emit('added-todo', { to:to, name: ui.item.text() });
              ui.item.remove();
            }
          }
        }
      });
    }
  }
})