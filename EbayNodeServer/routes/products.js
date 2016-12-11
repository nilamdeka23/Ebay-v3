
var logger = require('./logger');
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayWebServer/services/";

exports.createListing = function(req, res) {

	logger.info("USER ID: " + req.session.userId
			+ " TRIES TO LIST PRODUCT for SALE of PRODUCT NAME: "
			+ req.param("name"));

	var insertQuery = "insert into products (name, description, sellerId, sellerInfo, price, qty, isBiddable) values ('"
			+ req.param("name")
			+ "', '"
			+ req.param("desc")
			+ "', "
			+ req.session.userId
			+ ", '"
			+ req.param("sellerInfo")
			+ "', "
			+ req.param("price")
			+ ", "
			+ req.param("qty")
			+ ", "
			+ req.param("isBiddable") + ")";

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Products?wsdl";

	var args = {
		query : insertQuery
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

				if (createReturn.statusCode == 200) {

					logger.info("USER ID: " + req.session.userId
							+ " SUCCESSFULLY LISTED PRODUCT for SALE of PRODUCT NAME: "
							+ req.param("name"));

				}

				console.log("create listing", createReturn);

				res.send({
					statusCode : createReturn.statusCode
				});
			}

		});
	});
};

exports.getProducts = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " BROWSED PRODUCTS PAGE");

	var option = {
			ignoredNamespaces : true
		};

		var url = baseURL + "Products?wsdl";

		var args = {
			userId : req.session.userId
		};

		soap.createClient(url, option, function(err, client) {
			client.get(args, function(err, result) {
				if (err) {
					res.send({
						statusCode : 401
					});
				}
				if (result) {

					var getReturn = JSON.parse(result.getReturn);

					console.log("Products", getReturn);

					res.send(getReturn);
				}

			});
		});

};
