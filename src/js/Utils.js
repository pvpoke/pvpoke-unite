/*
* Common display and math functions used across the site
*/

// Round a float to a certain number of digits

function displayFloat(number, digits){
	number = number * (10 * digits);
	number = Math.round(number);
	number /= (10 * digits);

	return number;
}
