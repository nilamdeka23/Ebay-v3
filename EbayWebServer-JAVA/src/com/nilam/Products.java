package com.nilam;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import dbconfig.DBConnection;

import java.sql.ResultSet;

import javax.jws.WebService;

@WebService
public class Products {

	private DBConnection dbConnection = new DBConnection();

	public String get(String userId) {
		JSONObject result = new JSONObject();
		JSONArray data = new JSONArray();
		try {

			String query = "select * from products where sellerId != " + userId;
			ResultSet resultSet = dbConnection.getResultSet(query);

			while (resultSet.next()) {

				JSONObject product = new JSONObject();
				product.put("productId", resultSet.getInt("productId"));
				product.put("name", resultSet.getString("name"));
				product.put("description", resultSet.getString("description"));
				product.put("sellerId", resultSet.getInt("sellerId"));
				product.put("sellerInfo", resultSet.getString("sellerInfo"));
				product.put("price", resultSet.getDouble("price"));
				product.put("qty", resultSet.getInt("qty"));
				product.put("isBiddable", resultSet.getInt("isBiddable"));
				product.put("creationTime", resultSet.getString("creationTime"));

				data.add(product);
			}

			result.put("statusCode", "200");
			result.put("data", data);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return result.toString();
	}

	public String create(String query) {
		JSONObject result = new JSONObject();
		try {
			int insert = dbConnection.updateResultSet(query);
			if (insert == 1) {
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
