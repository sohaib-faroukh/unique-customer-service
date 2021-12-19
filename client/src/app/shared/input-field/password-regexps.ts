
/**
 * ^	The password string will start this way
 * (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
 * (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
 * (?=.*[0-9])	The string must contain at least 1 numeric character
 * (?=.*[!@#$%^&*])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
 * (?=.{8,})	The string must be eight characters or longer
 */

export const PasswordRegexMap =
{
	strong:
	{
		pattern: new RegExp( '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})' ),
		message: 'value must have least a lowercase, uppercase, numeric, special characters with 8 chars at least',
	},
	// medium:
	// {
	// 	pattern: new RegExp( '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})' ),
	// 	message: '',
	// },

};
