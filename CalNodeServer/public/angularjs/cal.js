/**
 * New node file
 */
var cal = angular.module('cal', []);

cal.controller('calCtrl',
		function($scope, $http) {

			$scope.divideByZero = true;

			var paramOnePresent = false;
			var paramTwoPresent = false;
			var resultDisplayed = true;
			var operationClicked = false;

			var paramOne;
			var paramTwo;
			var operator;

			$scope.calDisplay = 0;

			$scope.numPress = function(number) {
				if (resultDisplayed) {
					$scope.calDisplay = "";
					resultDisplayed = false;
				}
				$scope.calDisplay += String(number);
				operationClicked = false;
			};

			$scope.operation = function(sign) {
				// reset flag
				$scope.divideByZero = true;

				if (operationClicked) {
					return;
				}
				operationClicked = true;
				if (operator === "=") {
					paramOnePresent = false;
				}

				if (!paramOnePresent) {
					paramOne = Number($scope.calDisplay);
					paramOnePresent = true;
					resultDisplayed = true;
				} else if (!paramTwoPresent) {
					paramTwo = Number($scope.calDisplay);
					paramTwoPresent = true;
					resultDisplayed = true;
				}
				if (paramOnePresent && paramTwoPresent && operator
						&& operator !== '=') {
					var result;
					switch (operator) {
					case '+':
						$http({
							method : "POST",
							url : '/add',
							data : {
								"paramOne" : paramOne,
								"paramTwo" : paramTwo
							}
						}).success(function(data) {
							result = data.result;

							$scope.calDisplay = result;
							resultDisplayed = true;
							paramOne = Number(result);
							paramOnePresent = true;
							paramTwoPresent = false;

						}).error(function(error) {
							// TODO: set error flag
							// clear
						});
						break;

					case '-':
						$http({
							method : "POST",
							url : '/sub',
							data : {
								"paramOne" : paramOne,
								"paramTwo" : paramTwo
							}
						}).success(function(data) {
							result = data.result;

							$scope.calDisplay = result;
							resultDisplayed = true;
							paramOne = Number(result);
							paramOnePresent = true;
							paramTwoPresent = false;

						}).error(function(error) {
							// TODO: set error flag
							// clear
						});
						break;

					case '*':
						$http({
							method : "POST",
							url : '/mul',
							data : {
								"paramOne" : paramOne,
								"paramTwo" : paramTwo
							}
						}).success(function(data) {
							result = data.result;

							$scope.calDisplay = result;
							resultDisplayed = true;
							paramOne = Number(result);
							paramOnePresent = true;
							paramTwoPresent = false;

						}).error(function(error) {
							// TODO: set error flag
							// clear
						});
						break;

					case '/':
						$http({
							method : "POST",
							url : '/div',
							data : {
								"paramOne" : paramOne,
								"paramTwo" : paramTwo
							}
						}).success(function(data) {

							if (data.statusCode === 200) {
								result = data.result;

								$scope.calDisplay = result;
								resultDisplayed = true;
								paramOne = Number(result);
								paramOnePresent = true;
								paramTwoPresent = false;

							} else {
								// set divide by zero error
								$scope.divideByZero = false;
							}

						}).error(function(error) {
							// TODO: set error flag
							// clear
						});

						break;
					}

				}

				operator = sign;
				if (sign === "=") {
					operationClicked = false;
				}
			};

		});
