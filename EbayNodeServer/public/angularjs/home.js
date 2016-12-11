/**
 * New node file
 */
var home = angular.module("home", [ "ngRoute" ]);
home.config(function($routeProvider) {
	$routeProvider.when("/sell", {
		templateUrl : "templates/sell.html",
	}).when("/profile", {
		templateUrl : "templates/profile.html",
	}).when("/cart", {
		templateUrl : "templates/cart.html",
	}).when("/payment", {
		templateUrl : "templates/payment.html",
	}).when("/sales", {
		templateUrl : "templates/salesHistory.html",
	}).when("/purchases", {
		templateUrl : "templates/purchaseHistory.html",
	}).when("/bids", {
		templateUrl : "templates/bidStandings.html",
	}).otherwise({
		templateUrl : "templates/buy.html",
	});
});

home.controller("homeCtrl", function($scope) {

});

home.controller("bidsCtrl", function($scope, $http) {

	$scope.recordsFound = false;
	// fetch records
	$http({
		method : "GET",
		url : '/getBids'

	}).success(function(data) {

		if (data.statusCode == 401) {
			$scope.recordsFound = false;

		} else {
			$scope.recordsFound = true;
			$scope.records = data.data;
			var currentDate = new Date();
			for (var i = 0; i < $scope.records.length; i++) {
				if ($scope.records[i].maxBidderName === data.username) {
					$scope.records[i].maxBidderName = "You"
				}
				var validTillDate = new Date($scope.records[i].bidValidTime);
				$scope.records[i].biddingOn = "Yes!";
				$scope.records[i].winner = "-";
				if (currentDate > validTillDate) {
					$scope.records[i].biddingOn = "Over!"
					$scope.records[i].winner = $scope.records[i].maxBidderName;
				}
			}
		}

	}).error(function(error) {
		//
	});

});

home.controller("salesCtrl", function($scope, $http) {

	$scope.recordsFound = false;
	// fetch records
	$http({
		method : "GET",
		url : '/getSales'

	}).success(
			function(data) {

				if (data.statusCode == 401) {
					$scope.recordsFound = false;

				} else {
					$scope.records = data.data;

					if ($scope.records.length > 0) {
						$scope.recordsFound = true;
						$scope.total = 0;
						for (var i = 0; i < $scope.records.length; i++) {
							$scope.total += $scope.records[i].price
									* $scope.records[i].qtySold;
						}
					}

				}

			}).error(function(error) {
		//
	});

});

home.controller("purchaseCtrl", function($scope, $http) {

	$scope.recordsFound = false;
	// fetch records
	$http({
		method : "GET",
		url : '/getPurchases'

	}).success(
			function(data) {

				if (data.statusCode == 401) {
					$scope.recordsFound = false;

				} else {

					$scope.records = data.data;
					if ($scope.records.length > 0) {

						$scope.recordsFound = true;
						$scope.total = 0;
						for (var i = 0; i < $scope.records.length; i++) {
							$scope.total += $scope.records[i].productPrice
									* $scope.records[i].totalQty;
						}
					}
				}

			}).error(function(error) {
		//
	});

});

home.controller("buyCtrl", function($scope, $http) {

	$scope.successMsg = true;
	$scope.failureMsg = true;
	$scope.loadFailMsg = true;
	$scope.bidPlaced = true;
	$scope.bidNotPlaced = true;
	// fetch products
	$http({
		method : "GET",
		url : '/getProducts'

	}).success(function(data) {

		if (data.statusCode == 401) {
			$scope.loadFailMsg = false;

		} else {
			$scope.loadFailMsg = true;
			$scope.products = data.data;
		}

	}).error(function(error) {
		$scope.loadFailMsg = false;
	});

	$scope.addToCart = function(product) {

		$scope.addedProduct = product;

		$http({
			method : "POST",
			url : '/createOrder',
			data : {
				"cartItem" : product
			}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.failureMsg = false;
				$scope.successMsg = true;

			} else {
				$scope.successMsg = false;
				$scope.failureMsg = true;
			}

		}).error(function(error) {
			$scope.successMsg = true;
			$scope.failureMsg = false;
		});

	};

	$scope.placeBid = function(product, bidAmount) {

		$scope.addedProduct = product;

		$http({
			method : "POST",
			url : '/placeBid',
			data : {
				"productId" : product.productId,
				"bidAmount" : bidAmount
			}
		}).success(function(data) {
			if (data.statusCode === 401) {
				$scope.bidPlaced = true;
				$scope.bidNotPlaced = false;
			} else {
				$scope.bidPlaced = false;
				$scope.bidNotPlaced = true;
			}

		}).error(function(error) {
			// show failure
		});

	};

	$scope.isValidForBidding = function(bidCreatedOn) {

		var bidValidDate = new Date();
		// business rule- bid is valid till 4 days
		bidValidDate.setDate(new Date(bidCreatedOn).getDate() + 4);

		return new Date() < bidValidDate;
	};

});

home.controller("sellCtrl", function($scope, $http) {
	$scope.successMsg = true;
	$scope.failureMsg = true;
	$scope.isBiddable = 0;

	$scope.setQty = function(isBiddable) {
		if (isBiddable) {
			$scope.qty = isBiddable;
		}
	}

	$scope.submit = function() {

		console.log("List it clicked")

		$http({
			method : "POST",
			url : '/createListing',
			data : {
				"name" : $scope.name,
				"desc" : $scope.desc,
				"sellerInfo" : $scope.sellerInfo,
				"price" : $scope.price,
				"qty" : $scope.qty,
				"isBiddable" : $scope.isBiddable
			}
		}).success(function(data) {

			if (data.statusCode == 401) {
				$scope.failureMsg = false;
				$scope.successMsg = true;
			} else {
				$scope.failureMsg = true;
				$scope.successMsg = false;
				// clearing form input post submission
				var form = document.getElementsByName('listing-form')[0];
				form.reset();
			}

		}).error(function(error) {
			$scope.failureMsg = false;
			$scope.successMsg = true;

		});

	};

});

home.controller("profileCtrl", function($scope, $http) {

	$scope.successMsg = true;
	$scope.failureMsg = true;
	$scope.disabled = true;
	// fetch user profile
	$http({
		method : "GET",
		url : '/getProfile'

	}).success(function(data) {

		if (data.statusCode == 401) {
			// TODO: error handling

		} else {
			$scope.email = data.data.email;
			$scope.password = data.data.password;
			$scope.firstName = data.data.firstName;
			$scope.lastName = data.data.lastName;
			$scope.about = data.data.about;
			if (data.data.dob) {
				$scope.dob = new Date(data.data.dob);
			}
			$scope.contact = data.data.contact;
			$scope.address = data.data.address;
		}

	}).error(function(error) {
		//
	});

	$scope.update = function() {

		$http({
			method : "POST",
			url : '/updateProfile',
			data : {
				"email" : $scope.email,
				"password" : $scope.password,
				"firstName" : $scope.firstName,
				"lastName" : $scope.lastName,
				"about" : $scope.about,
				"dob" : new Date($scope.dob),
				"contact" : $scope.contact,
				"address" : $scope.address
			}
		}).success(function(data) {

			if (data.statusCode == 401) {
				$scope.failureMsg = false;

			} else {
				$scope.successMsg = false;
				$scope.disabled = true;
			}

		}).error(function(error) {
			$scope.failureMsg = false;
		});

	};

	$scope.edit = function() {
		$scope.disabled = false;
		$scope.successMsg = true;
		$scope.failureMsg = true;
		$scope.password = "";
	};

});

home.controller("cartCtrl", function($scope, $http) {

	$scope.failureMsg = true;
	$scope.total = 0;
	$scope.successPayment = true;
	$scope.failurePayment = true;
	$scope.isCartEmpty = true;
	// fetch cart items
	$http({
		method : "GET",
		url : '/getCart'

	}).success(
			function(data) {
				if (data.statusCode == 401) {
					// TODO: error handling

				} else {
					$scope.cart = data.data;
					$scope.isCartEmpty = $scope.cart.length > 0 ? false : true;
					for (var i = 0; i < $scope.cart.length; i++) {
						$scope.total += $scope.cart[i].productPrice
								* $scope.cart[i].qty;
					}

				}

			}).error(function(error) {
		// 
	});

	$scope.updateTotal = function() {
		var newTotal = 0;
		for (var i = 0; i < $scope.cart.length; i++) {
			newTotal += $scope.cart[i].productPrice * $scope.cart[i].qty;
		}
		$scope.total = newTotal;
	};

	$scope.removeCartItem = function(product) {
		// update db
		$http({
			method : "POST",
			url : '/removeCartItem',
			data : {
				"productId" : product.productId
			}
		}).success(function(data) {

			if (data.statusCode == 401) {
				$scope.failureMsg = false;

			} else {
				$scope.failureMsg = true;
				$scope.cart.splice($scope.cart.indexOf(product), 1);
				$scope.isCartEmpty = $scope.cart.length > 0 ? false : true;
				$scope.updateTotal();
			}

		}).error(function(error) {
			// 
		});

	};// end of removeCartItem

	$scope.updateCartItem = function(product) {

		if (product.qty <= product.inStockQty) {
			// update db
			$http({
				method : "POST",
				url : '/updateCartItem',
				data : {
					"productId" : product.productId,
					"qty" : product.qty
				}
			}).success(function(data) {
				if (data.statusCode == 401) {
					console.log("cart Item NOT Updated");
				} else {
					console.log("cart Item Updated");
				}

			}).error(function(error) {
				// TODO: error handling
			});

		} else {
			product.qty = product.inStockQty;
		}

	};

	$scope.makePayment = function() {

		$http({
			method : "POST",
			url : '/makePayment',
			data : {
				"cardNum" : $scope.cardNum,
				"cardCVV" : $scope.cardCVV
			}
		}).success(function(data) {
			if (data.statusCode == 401) {
				$scope.successPayment = true;
				$scope.failurePayment = false;

			} else {
				$scope.successPayment = false;
				$scope.failurePayment = true;
				// update db
				$http({
					method : "POST",
					url : '/placeOrder',
					data : {
						"cart" : $scope.cart
					}
				}).success(function(data) {
					// checking the response data for statusCode
					if (data.statusCode == 401) {
						// show error
					} else {
						window.location.assign("/home");
					}

				}).error(function(error) {
					// 
				});

			}

		}).error(function(error) {
			//
		});

	};

});
