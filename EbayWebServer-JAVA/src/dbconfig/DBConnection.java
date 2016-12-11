package dbconfig;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBConnection {

	private Connection getConnection() throws SQLException {
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}

		Connection connection = null;

		try {
			connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/lab1", "root", "14millerMS");

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return connection;
	}

	public ResultSet getResultSet(String query) throws SQLException {
		Connection connection = getConnection();
		Statement statement = (Statement) connection.createStatement();
		return statement.executeQuery(query);
	}

	public int updateResultSet(String query) throws SQLException {
		Connection connection = getConnection();
		Statement statement = (Statement) connection.createStatement();
		return statement.executeUpdate(query);
	}

}
