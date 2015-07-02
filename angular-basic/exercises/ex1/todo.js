angular.module('todoApp', [])
	.controller('TodoListController', function ($scope) {

		$scope.todoBlocks = [
			{
				title: 'My superheroic Angular todo list',
				todos: [
					{text: 'Learn Angular Bascis', done: true},
					{text: 'Learn Angular Intermediate'},
					{text: 'Learn Angular Advanced'}
				]
			},
			{
				title: 'My other non superheroic todo list',
				todos: [
					{text: 'Do shopping'},
					{text: 'Clean car'}
				]
			}
		];

		$scope.addTodoItem = function (todoBlock, index) {
			$scope.todoBlocks[index].todos.push({text: todoBlock.todoText});
			todoBlock.todoText = '';
		};

	});