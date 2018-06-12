angular.module('todoApp', [])
	.controller('TodoAppController', function($scope, $timeout) {
		
		$scope.todoLists = [
			{ title: 'My Superheroic Angular to do list',
			  todos: [
			  	{ text: 'Learn angular basic', done: true},
			  	{ text: 'Task 2', done: false},
			  	{ text: 'Task 3', done: false}
			  ] 
			},
			{ title: 'My non superheroic to do list',
			  todos: [
			  	{ text: 'Wash car', done: false},
			  	{ text: 'Do shopping', done: false}
			  ] 
			}
		];

		$scope.addTodo = function (todoList) {
			console.log(todoList.text);
			todoList.todos.push({text: todoList.text, done: false});
			todoList.text = '';
		};
		
	});