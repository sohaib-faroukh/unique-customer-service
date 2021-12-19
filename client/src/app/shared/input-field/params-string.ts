
/**
 * this class is responsible on replace each $number (variable reference) in a string by the variable value
 */
export class ParamString {
	static readonly paramStringRegex = /\$\d+/g;


	static isValidParamString = ( input: string, replacements: string[] ): boolean => {
		input ||= '';
		return ( replacements.length >= ( input.match( ParamString.paramStringRegex )?.length || 0 ) ) || false;
	}


	static injectParamsValuesInString = ( input: string, replacements: string[] ): string => {
		input ||= '';
		if ( !ParamString.isValidParamString( input, replacements ) ) return input;
		return input.replace( ParamString.paramStringRegex, ( substring: string ): string => {
			if ( substring.length < 2 ) return '';
			const num = Number( substring.substring( 1 ) );
			if ( num <= 0 ) return '';
			const index = num - 1;
			if ( !replacements[ index ] ) return '';
			const replacement = replacements[ index ];
			return replacement;
		} ) || input;
	}


}
