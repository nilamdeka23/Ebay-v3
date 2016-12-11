package com.nilam;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import dbconfig.DBConnection;

import java.sql.ResultSet;

import javax.jws.WebService;

@WebService
public class Orders {

	private DBConnection dbConnection = new DBConnection();

	public String create(String userId, String productId, String insertQuery) {
		JSONObject result = new JSONObject();
		try {

			String query = "select * from orders where buyerId = " + userId + " and productId =" + productId
					+ " and isPaidFor= 0";
			ResultSet resultSet = dbConnection.getResultSet(query);

			if (resultSet.next()) {

				query = "update orders set qty = qty + 1 where buyerId = " + userId + " and productId =" + productId
						+ " and isPaidFor= 0";
				int update = dbConnection.updateResultSet(query);
				if (update == 1) {
					result.put("statusCode", "200");
				} else {
					result.put("statusCode", "401");
				}

			} else {

				int insert = dbConnection.updateResultSet(insertQuery);
				if (insert == 1) {
					result.put("statusCode", "200");
				} else {
					result.put("statusCode", "401");
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

	public String getcart(String userId) {
		JSONObject result = new JSONObject();
		JSONArray data = new JSONArray();
		try {

			String query = "select * from orders where buyerId = " + userId + " and isPaidFor = 0";
			ResultSet resultSet = dbConnection.getResultSet(query);

			while (resultSet.next()) {

				JSONObject order = new JSONObject();
				order.put("orderId", resultSet.getInt("orderId"));
				order.put("buyerId", resultSet.getInt("buyerId"));
				order.put("productId", resultSet.getInt("productId"));
				order.put("qty", resultSet.getInt("qty"));
				order.put("isPaidFor", resultSet.getInt("isPaidFor"));
				order.put("inStockQty", resultSet.getInt("inStockQty"));
				order.put("productName", resultSet.getString("productName"));
				order.put("productDesc", resultSet.getString("productDesc"));
				order.put("productPrice", resultSet.getDouble("productPrice"));
				order.put("modifiedTime", resultSet.getString("modifiedTime"));

				data.add(order);
			}

			result.put("statusCode", "200");
			result.put("data", data);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

	public String updatecart(String userId, String productId, String qty) {
		JSONObject result = new JSONObject();
		try {

			String query = "update orders set qty = " + qty + " where buyerId = " + userId + " and productId ="
					+ productId + " and isPaidFor= 0";

			int update = dbConnection.updateResultSet(query);

			if (update == 1) {
				result.put("statusCode", "200");
			} else {
				result.put("statusCode", "401");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

	public String removecart(String userId, String productId) {
		JSONObject result = new JSONObject();
		try {

			String query = "delete from orders where buyerId =" + userId + " and productId = " + productId
					+ " and isPaidFor = 0";

			int delete = dbConnection.updateResultSet(query);

			if (delete == 1) {
				result.put("statusCode", "200");
			} else {
				result.put("statusCode", "401");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

}
