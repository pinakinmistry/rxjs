angular.module('todoApp', [])
	.controller('TodoListController', function ($scope) {

		$scope.todoLists = [
			{
				title: 'My superheroic Angular todo list',
				todos: [
					{text: 'Learn Angular Bascis', done: true},
					{text: 'Learn Angular Intermediate', done: false},
					{text: 'Learn Angular Advanced', done: false}
				]
			},
			{
				title: 'My other non superheroic todo list',
				todos: [
					{text: 'Do shopping', done: false},
					{text: 'Clean car', done: false}
				]
			}
		];

		$scope.addTodoItem = function (todoList, index) {
			$scope.todoLists[index].todos.push({text: todoList.todoText, done: false});
			todoList.todoText = '';
		};

	});