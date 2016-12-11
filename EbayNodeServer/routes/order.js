
var logger = require('./logger');
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayWebServer/services/";

exports.createOrder = function(req, res) {

	var cartItem = req.param("cartItem");

	logger.info("USER ID: " + req.session.userId
			+ "  ADDED ITEM with PRODUCT ID: " + cartItem.productId
			+ " to the CART");

	var createOrder = "insert into orders (buyerId, productId, productName, productDesc, sellerInfo, inStockQty, productPrice) values ("
			+ req.session.userId
			+ ", "
			+ cartItem.productId
			+ ", '"
			+ cartItem.name
			+ "', '"
			+ cartItem.description
			+ "', '"
			+ cartItem.sellerInfo
			+ "', "
			+ cartItem.qty
			+ ", "
			+ cartItem.price + ")";

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Orders?wsdl";

	var args = {
		userId : req.session.userId,
		productId : cartItem.productId,
		insertQuery : createOrder
	};

	soap.createClient(url, option, function(err, client) {
		client.create(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var createReturn = JSON.parse(result.createReturn);

				console.log("Create Order", createReturn);

				res.send(createReturn);
			}

		});
	});
};

exports.getCart = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED CART ITEMS");

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Orders?wsdl";

	var args = {
		userId : req.session.userId
	};

	soap.createClient(url, option, function(err, client) {
		client.getcart(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var getcartReturn = JSON.parse(result.getcartReturn);

				console.log("Get Cart", getcartReturn);

				res.send(getcartReturn);
			}

		});
	});

};

var mysql = require('./mysql');

exports.placeOrder = function(req, res) {

	logger.info("USER ID: " + req.session.userId + "  PLACED an ORDER");

	var cart = req.param("cart");

	for (var i = 0; i < cart.length; i++) {

		var updateQty = "update products set qty = qty -" + cart[i].qty
				+ " where productId = " + cart[i].productId;

		mysql.fetchData(function(err, results) {

			if (err) {
				throw err;

			} else {
				var json_response;

				if (results.affectedRows > 0) {

					console.log("Quantity updated");

				} else {

					console.log("Quantity NOT updated");
				}
			}
		}, updateQty);

	}

	var placeOrder = "update orders set isPaidFor = 1 where buyerId = "
			+ req.session.userId + " and isPaidFor= 0";

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;

		} else {
			var json_response;

			if (results.affectedRows > 0) {

				json_response = {
					"statusCode" : 200,
					"data" : results
				};
				res.send(json_response);

			} else {

				json_response = {
					"statusCode" : 401
				};
				res.send(json_response);
			}
		}
	}, placeOrder);

};

exports.updateCartItem = function(req, res) {

	logger.info("USER ID: " + req.session.userId
			+ " tried UPDATING an ITEM  with PRODUCT ID: "
			+ req.param("productId") + " from the CART");

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Orders?wsdl";

	var args = {
		userId : req.session.userId,
		productId : req.param("productId"),
		qty : req.param("qty")
	};

	soap.createClient(url, option, function(err, client) {
		client.updatecart(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var updatecartReturn = JSON.parse(result.updatecartReturn);

				console.log("Update Cart", updatecartReturn);

				res.send(updatecartReturn);
			}

		});
	});
};

exports.removeCartItem = function(req, res) {

	logger.info("USER ID: " + req.session.userId
			+ " tried REMOVING an ITEM  with PRODUCT ID: "
			+ req.param("productId") + " from the CART");

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Orders?wsdl";

	var args = {
		userId : req.session.userId,
		productId : req.param("productId")
	};

	soap.createClient(url, option, function(err, client) {
		client.removecart(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var removecartReturn = JSON.parse(result.removecartReturn);

				console.log("Remove Cart", removecartReturn);

				res.send(removecartReturn);
			}

		});
	});
}
