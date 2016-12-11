var logger = require('./logger');
var soap = require('soap');
var baseURL = "http://localhost:8080/EbayWebServer/services/";

exports.placeBid = function(req, res) {

	var option = {
		ignoredNamespaces : true
	};

	var url = baseURL + "Bidding?wsdl";
	
	var args = {
		userId : req.session.userId,
		productId : req.param("productId"),
		bidAmount : req.param("bidAmount")
	};

	soap.createClient(url, option, function(err, client) {
		client.place(args, function(err, result) {
			if (err) {
				res.send({
					statusCode : 401
				});
			}
			if (result) {

				var placeReturn = JSON.parse(result.placeReturn);

				if (placeReturn.statusCode == 200) {

					logger.info("USER ID: " + req.session.userId
							+ "  PLACED BID $" + req.param("bidAmount")
							+ " FOR ITEM with PRODUCT ID: "
							+ req.param("productId") + " to the CART");

				}

				console.log("Place Bid", placeReturn);

				res.send(placeReturn);
			}

		});
	});
};
