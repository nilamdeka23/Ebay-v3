package com.nilam;

import java.sql.ResultSet;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import dbconfig.DBConnection;

public class Records {

	private DBConnection dbConnection = new DBConnection();

	public String getpurchases(String userId) {
		JSONObject result = new JSONObject();
		JSONArray data = new JSONArray();
		try {

			String query = "select productName, productDesc, productPrice, sellerInfo, sum(qty) as totalQty from orders where buyerId = "
					+ userId + " and isPaidFor = 1 group by productId";
			ResultSet resultSet = dbConnection.getResultSet(query);

			while (resultSet.next()) {

				JSONObject record = new JSONObject();
				record.put("productName", resultSet.getString("productName"));
				record.put("productDesc", resultSet.getString("productDesc"));
				record.put("productPrice", resultSet.getDouble("productPrice"));
				record.put("sellerInfo", resultSet.getString("sellerInfo"));
				record.put("totalQty", resultSet.getInt("totalQty"));

				data.add(record);
			}

			result.put("statusCode", "200");
			result.put("data", data);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

	public String getsales(String userId) {
		JSONObject result = new JSONObject();
		JSONArray data = new JSONArray();
		try {

			String query = "select productName, productDesc, sum(orders.qty) as qtySold, price from orders inner join products on orders.productId = products.productId where sellerId ="
					+ userId + " and isPaidFor = 1 group by products.productId order by modifiedTime";
			ResultSet resultSet = dbConnection.getResultSet(query);

			// select bidAmount as maxBidAmount, firstname as maxBidderName,
			// biddingTime as bidTime, name as productName, description as
			// productDesc from lab1.users, lab1.bids, lab1.products where
			// users.userId = bids.bidderId and bids.bidProductId =
			// products.productId and bidAmount = (select max(bidAmount) from
			// bids where bids.bidProductId = products.productId) group by
			// productId;

			while (resultSet.next()) {

				JSONObject record = new JSONObject();
				record.put("productName", resultSet.getString("productName"));
				record.put("productDesc", resultSet.getString("productDesc"));
				record.put("qtySold", resultSet.getString("qtySold"));
				record.put("price", resultSet.getDouble("price"));

				data.add(record);
			}

			result.put("statusCode", "200");
			result.put("data", data);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

	public String getbids(String userId) {
		JSONObject result = new JSONObject();
		JSONArray data = new JSONArray();
		try {

			String query = "select bidderId, bidAmount as maxBidAmount, firstname as maxBidderName, biddingTime as bidTime, name as productName, description as productDesc from lab1.users, lab1.bids, lab1.products where users.userId = bids.bidderId and bids.bidProductId = products.productId and bidAmount = (select max(bidAmount) from bids where bids.bidProductId = products.productId) group by productId";
			ResultSet resultSet = dbConnection.getResultSet(query);

			while (resultSet.next()) {

				if (Integer.parseInt(userId) == resultSet.getInt("bidderId")) {
					JSONObject record = new JSONObject();
					record.put("maxBidAmount", resultSet.getDouble("maxBidAmount"));
					record.put("maxBidderName", resultSet.getString("maxBidderName"));
					record.put("productName", resultSet.getString("productName"));
					record.put("productDesc", resultSet.getString("productDesc"));
					record.put("bidTime", resultSet.getString("bidTime"));

					data.add(record);
				}
			}

			result.put("statusCode", "200");
			result.put("data", data);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

}
