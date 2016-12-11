package com.nilam;

import javax.jws.WebService;

@WebService
public class Calculation {

	public float add(float paramOne, float paramTwo) {
		return paramOne + paramTwo;
	}

	public float sub(float paramOne, float paramTwo) {
		return paramOne - paramTwo;
	}

	public float mul(float paramOne, float paramTwo) {
		return paramOne * paramTwo;
	}

	public float div(float paramOne, float paramTwo) {
		if (paramTwo != 0)
			return paramOne / paramTwo;
		else
			return 0;
	}

}
