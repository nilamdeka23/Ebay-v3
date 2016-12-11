var logger = require('./logger');
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayWebServer/services/";

exports.getPurchases = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED PURCHASE HISTORY");

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Records?wsdl";

	var args = {
		userId : req.session.userId
	};

	soap.createClient(url, option, function(err, client) {
		client.getpurchases(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var purchaseRecords = JSON.parse(result.getpurchasesReturn);

				console.log("Purchase History", purchaseRecords);

				res.send(purchaseRecords);
			}

		});
	});

};

exports.getSales = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED SALES HISTORY");

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Records?wsdl";

	var args = {
		userId : req.session.userId
	};

	soap.createClient(url, option, function(err, client) {
		client.getsales(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var salesRecords = JSON.parse(result.getsalesReturn);

				console.log("Sales History", salesRecords);

				res.send(salesRecords);
			}

		});
	});

};

exports.getBids = function(req, res) {

	logger.info("USER ID: " + req.session.userId + " VIEWED BID STANDINGS");

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Records?wsdl";

	var args = {
		userId : req.session.userId
	};

	soap.createClient(url, option, function(err, client) {
		client.getbids(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var biddingRecords = JSON.parse(result.getbidsReturn);

				biddingRecords.username = req.session.firstname;
				console.log("Bid Standings", biddingRecords);

				res.send(biddingRecords);
			}

		});
	});

};
